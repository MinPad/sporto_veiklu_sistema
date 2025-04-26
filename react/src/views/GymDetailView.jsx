import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axios';
import PageComponent from '../components/PageComponent';
import LoadingDialog from "../components/core/LoadingDialog";
import TButton from '../components/core/TButton';
import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon, UserGroupIcon, ChatBubbleLeftRightIcon, StarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useStateContext } from '../contexts/ContexProvider';
import SuccessAlert from '../components/core/SuccessAlert';
import ConfirmationDialog from "../components/core/ConfirmationDialog";

import ReviewEditor from "../components/reviews/ReviewEditor";

export default function GymDetailView() {
    const { cityId, gymId } = useParams();
    const [gym, setGym] = useState(null);
    const [coaches, setCoaches] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [hoveredRating, setHoveredRating] = useState(0);
    const [hasReviewed, setHasReviewed] = useState(false);

    const { userToken, currentUser } = useStateContext();

    const [successMessage, setSuccessMessage] = useState('');
    const successTimeoutRef = useRef(null);
    const showSuccessMessage = (msg) => {
        setSuccessMessage(msg);
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
            setSuccessMessage('');
            successTimeoutRef.current = null;
        }, 3000);
    };

    const [editingReview, setEditingReview] = useState(null);
    const [editComment, setEditComment] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    const editSectionRef = useRef(null);
    const FilledStar = (props) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M12 .587l3.668 7.568L24 9.748l-6 5.855 1.416 8.252L12 19.771l-7.416 4.084L6 15.603 0 9.748l8.332-1.593L12 .587z" />
        </svg>
    );
    useEffect(() => {
        setLoading(true);
        const fetchGym = axiosClient.get(`/cities/${cityId}/gyms/${gymId}`);
        const fetchCoaches = axiosClient.get(`/cities/${cityId}/gyms/${gymId}/coaches`);
        const fetchReviews = axiosClient.get(`/gyms/${gymId}/reviews`);

        Promise.all([fetchGym, fetchCoaches, fetchReviews])
            .then(([gymRes, coachRes, reviewRes]) => {
                setGym(gymRes.data);
                setCoaches(coachRes.data?.data || []); // ensures .slice works correctly
                setReviews(reviewRes.data);
                if (currentUser?.id) {
                    const alreadyReviewed = reviewRes.data.some(r => r.user_id === currentUser.id);
                    setHasReviewed(alreadyReviewed);
                }
            })
            .catch((err) => {
                console.error('Error loading gym data:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cityId, gymId]);
    useEffect(() => {
        if (currentUser?.id && reviews.length > 0) {
            const alreadyReviewed = reviews.some(r => r.user_id === currentUser.id);
            setHasReviewed(alreadyReviewed);
        }
    }, [currentUser, reviews]);
    const handleReviewSubmit = async () => {
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const res = await axiosClient.post(`/gyms/${gymId}/reviews`, {
                rating: newRating,
                comment: newComment,
            });

            setReviews((prev) => [
                {
                    ...res.data,
                    user: {
                        id: currentUser.id,
                        name: currentUser.name,
                    },
                },
                ...prev,
            ]);
            setHasReviewed(true);
            showSuccessMessage("Review submitted successfully!");
            setNewRating(0);
            setNewComment('');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setErrorMessage('You have already reviewed this gym.');
            } else {
                setErrorMessage('An error occurred while submitting the review.');
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const confirmDeleteReview = async () => {
        try {
            await axiosClient.delete(`/reviews/${reviewToDelete.id}`);
            setReviews(reviews.filter(r => r.id !== reviewToDelete.id));
            setHasReviewed(false);
            showSuccessMessage("Review deleted successfully!");
        } catch (err) {
            console.error("Failed to delete review", err);
        } finally {
            setIsDialogOpen(false);
            setReviewToDelete(null);
        }
    };
    const averageRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    // console.log("averageRating:", averageRating);
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FilledStar key={`full-${i}`} className="w-5 h-5 text-yellow-500" />);
        }

        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative w-5 h-5">
                    <FilledStar className="text-gray-300 w-5 h-5 absolute" />
                    <div className="overflow-hidden w-1/2 absolute top-0 left-0">
                        <FilledStar className="text-yellow-500 w-5 h-5" />
                    </div>
                </div>
            );
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FilledStar key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
        }

        return <div className="flex items-center gap-0.5">{stars}</div>;
    };
    if (loading) {
        return (
            <PageComponent title="Loading...">
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            </PageComponent>
        );
    }

    if (!gym) {
        return <PageComponent title="Gym not found">Could not find the gym.</PageComponent>;
    }

    return (
        <>
            <PageComponent
                title={gym.name}
                buttons={
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
                        <TButton
                            to={`/cities/${cityId}/gyms/`}
                            className="flex items-center justify-center w-full sm:w-auto"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to City
                        </TButton>

                    </div>
                }>
                {successMessage && (
                    <div className="mb-4 px-4">
                        <SuccessAlert message={successMessage} />
                    </div>
                )}
                <div className="container mx-auto px-4 space-y-16">
                    {/* Gym Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <img
                            src={gym.image_url}
                            alt={gym.name}
                            className="w-full h-64 md:h-72 object-cover rounded-2xl shadow-md"
                        />
                        <div>
                            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                                {gym.name}
                                {averageRating > 0 && (
                                    <div className="flex items-center gap-1">
                                        {renderStars(averageRating)}
                                        <span className="text-sm text-gray-500">({averageRating.toFixed(1)})</span>
                                    </div>
                                )}
                            </h2>
                            <p className="text-gray-700 mb-1"><strong>Address:</strong> {gym.address}</p>
                            <p className="text-gray-700 mb-1"><strong>Opening Hours:</strong> {gym.openingHours}</p>
                            <p className="text-gray-700 mb-1">
                                <strong>Price:</strong>{" "}
                                {gym.isFree ? (
                                    <span className="text-green-600 font-medium">Free</span>
                                ) : (
                                    <span>€{parseFloat(gym.monthlyFee || 0).toFixed(2)} / month</span>
                                )}
                            </p>
                            <div className="mt-3">
                                <strong>Specialties:</strong>
                                {gym.specialties?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {gym.specialties.map((spec) => (
                                            <span key={spec.id} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                {spec.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic mt-1">No specialties listed.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coaches */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Coaches ({coaches.length})</h3>
                        {coaches.length === 0 ? (
                            <p className="text-gray-500">No coaches available.</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    {coaches.slice(0, 3).map((coach) => (
                                        <div key={coach.id} className="border rounded-xl p-4 bg-white shadow hover:shadow-lg transition-transform hover:scale-[1.02]">
                                            <div className="flex items-center gap-2 mb-2">
                                                <UserGroupIcon className="w-5 h-5 text-gray-600" />
                                                <p className="font-semibold text-sm">
                                                    {coach.name} {coach.surname}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                <strong>Specialty:</strong> {coach.specialties?.length
                                                    ? coach.specialties.map(s => s.name).join(', ')
                                                    : <em className="text-gray-400">None</em>}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                            </>
                        )}
                        <div className="flex justify-center">
                            <TButton to={`/cities/${cityId}/gyms/${gymId}/coaches`} className="flex items-center px-4">
                                <UserGroupIcon className="w-5 h-5 mr-2" />
                                View All Coaches
                            </TButton>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">User Reviews ({reviews.length})</h3>
                        {reviews.length === 0 ? (
                            <div className="text-center text-gray-500 italic">
                                📝 No reviews yet. Be the first to share your experience!
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {reviews.slice(0, 3).map((review) => (
                                        <div key={review.id} className="border rounded-xl bg-white p-4 shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{review.user?.name || 'User'}</p>
                                                    <p className="text-gray-700 mt-2">{review.comment}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <p className="text-yellow-500 text-sm">
                                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                    </p>
                                                    {currentUser?.id === review.user?.id && (
                                                        <div className="flex gap-2 mt-2 justify-end">
                                                            <TButton
                                                                size="sm"
                                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                onClick={() => {
                                                                    setEditingReview(review);
                                                                    setEditComment(review.comment || '');
                                                                    setEditRating(review.rating);
                                                                    setTimeout(() => {
                                                                        editSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                    }, 100);
                                                                }}
                                                            >
                                                                <PencilIcon className="w-4 h-4 mr-1" />
                                                                Edit
                                                            </TButton>
                                                            <TButton
                                                                size="sm"
                                                                color="red"
                                                                onClick={() => {
                                                                    setIsDialogOpen(true);
                                                                    setReviewToDelete(review);
                                                                }}
                                                            >
                                                                <TrashIcon className="w-4 h-4 mr-1" />
                                                                Delete
                                                            </TButton>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    <TButton to={`/cities/${cityId}/gyms/${gymId}/reviews`} className="flex items-center px-4">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                                        View All Reviews
                                    </TButton>
                                </div>
                            </>
                        )}
                    </div>


                    {/* Leave Review */}
                    {userToken ? (
                        hasReviewed ? (
                            <div className="mt-6 border-t pt-6 text-sm text-green-600 italic text-center">
                                ✅ You’ve already submitted a review for this gym.
                            </div>
                        ) : (
                            <div className="mt-6 border-t pt-6">
                                <h4 className="text-lg font-semibold mb-2">Leave a Review</h4>
                                {errorMessage && (
                                    <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
                                )}
                                <div className="flex items-center gap-1 mb-2">
                                    <label htmlFor="rating" className="text-sm font-medium mr-2">Rating:</label>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`text-2xl transition-colors ${(hoveredRating || newRating) >= star ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            onClick={() => setNewRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="w-full border rounded-lg p-2 text-sm mb-4"
                                    rows={3}
                                    placeholder="Optional comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <TButton onClick={handleReviewSubmit} disabled={isSubmitting || newRating === 0}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </TButton>
                            </div>
                        )
                    ) : (
                        <div className="mt-6 border-t pt-6 text-sm text-gray-500 italic text-center">
                            🔒 You must be logged in to leave a review.
                        </div>
                    )}

                    {/* Edit Review */}
                    {editingReview && (
                        <div ref={editSectionRef}>
                            <ReviewEditor
                                editingReview={editingReview}
                                initialRating={editingReview.rating}
                                initialComment={editingReview.comment}
                                onSave={async ({ id, rating, comment }) => {
                                    try {
                                        await axiosClient.put(`/reviews/${id}`, {
                                            rating,
                                            comment
                                        });
                                        const updated = reviews.map(r =>
                                            r.id === id ? { ...r, rating, comment } : r
                                        );
                                        setReviews(updated);
                                        setEditingReview(null);
                                        showSuccessMessage("Review updated successfully!");
                                    } catch (err) {
                                        console.error("Failed to update review", err);
                                    }
                                }}
                                onCancel={() => setEditingReview(null)}
                            />
                        </div>
                    )}

                </div>
            </PageComponent>

            {/* Delete Confirmation */}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Delete Review"
                message="Are you sure you want to delete your review? This action cannot be undone."
                onConfirm={confirmDeleteReview}
            />
        </>
    );

}