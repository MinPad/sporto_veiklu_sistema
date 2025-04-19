import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PageComponent from "../components/PageComponent";
import LoadingDialog from "../components/core/LoadingDialog";
import TButton from "../components/core/TButton";
import ConfirmationDialog from "../components/core/ConfirmationDialog";
import { TrashIcon, ChatBubbleLeftRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../contexts/ContexProvider";
import axiosClient from "../axios";
import ReviewEditor from "../components/reviews/ReviewEditor";
import SuccessAlert from '../components/core/SuccessAlert';

export default function GymReviewsView() {
    const { cityId, gymId } = useParams();
    const { currentUser, userRole } = useStateContext();
    // console.log("role", userRole);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [editingReview, setEditingReview] = useState(null);
    const [editComment, setEditComment] = useState('');
    const [editRating, setEditRating] = useState(0);

    const [showReviewForm, setShowReviewForm] = useState(false);

    const [gym, setGym] = useState(null);

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
    useEffect(() => {
        setLoading(true);
        const fetchReviews = axiosClient.get(`/gyms/${gymId}/reviews`);
        const fetchGym = axiosClient.get(`/cities/${cityId}/gyms/${gymId}`);

        Promise.all([fetchReviews, fetchGym])
            .then(([reviewsRes, gymRes]) => {
                setReviews(reviewsRes.data);
                setGym(gymRes.data);
            })
            .catch(err => console.error("Error loading reviews or gym:", err))
            .finally(() => setLoading(false));
    }, [gymId]);

    const confirmDelete = () => {
        if (!reviewToDelete) return;

        axiosClient.delete(`/reviews/${reviewToDelete.id}`)
            .then(() => {
                setReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
            })
            .catch(err => {
                console.error("Failed to delete review:", err);
            })
            .finally(() => {
                setIsDialogOpen(false);
                setReviewToDelete(null);
                showSuccessMessage("Review deleted successfully!");
            });
    };
    if (loading || !gym) {
        return (
            <PageComponent title="Loading...">
                <div className="flex justify-center items-center h-40">
                    <LoadingDialog />
                </div>
            </PageComponent>
        );
    }
    return (
        <PageComponent
            title={gym ? `All Reviews in "${gym.name}"` : (
                <div className="flex items-center gap-2">
                    <LoadingDialog size="sm" />
                    Loading City...
                </div>
            )}
            buttons={
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
                    <TButton
                        to={`/cities/${cityId}/gyms/${gymId}/details`}
                        className="flex items-center justify-center w-full sm:w-auto"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Gym
                    </TButton>

                    {currentUser && !reviews.some(r => r.user_id === currentUser.id) && (
                        <TButton
                            color="green"
                            onClick={() => setShowReviewForm(prev => !prev)}
                            className="flex items-center justify-center w-full sm:w-auto"
                        >
                            <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                            {showReviewForm ? "Hide Review Form" : "Leave a Review"}
                        </TButton>
                    )}
                </div>
            }
        >

            {/* <div className="w-full px-4 sm:px-0 mb-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <TButton
                    to={`/cities/${cityId}/gyms/${gymId}/details`}
                    className="flex items-center justify-center w-full sm:w-auto"
                >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Back to Gym
                </TButton>

                {currentUser && !reviews.some(r => r.user_id === currentUser.id) && (
                    <TButton
                        color="green"
                        onClick={() => setShowReviewForm(prev => !prev)}
                        className="flex items-center justify-center w-full sm:w-auto"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                        {showReviewForm ? "Hide Review Form" : "Leave a Review"}
                    </TButton>
                )}
            </div> */}
            {successMessage && (
                <div className="mb-4 px-4">
                    <SuccessAlert message={successMessage} />
                </div>
            )}
            {showReviewForm && (
                <div className="container mx-auto py-4">
                    <ReviewEditor
                        title="Leave a Review"
                        onSave={async ({ rating, comment }) => {
                            try {
                                const res = await axiosClient.post(`/gyms/${gymId}/reviews`, {
                                    rating,
                                    comment,
                                });
                                setReviews(prev => [
                                    {
                                        ...res.data,
                                        user: { id: currentUser.id, name: currentUser.name }
                                    },
                                    ...prev,
                                ]);
                                setShowReviewForm(false);
                                showSuccessMessage("Review created successfully!");
                            } catch (err) {
                                console.error("Error submitting review", err);
                            }
                        }}
                        onCancel={() => setShowReviewForm(false)}
                    />
                </div>
            )}
            <div className="container mx-auto py-4 space-y-4">
                {loading ? (
                    <LoadingDialog />
                ) : reviews.length === 0 ? (
                    <p className="text-center text-gray-500 italic">No reviews yet for this gym.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border rounded-xl bg-white p-4 shadow-sm space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{review.user?.name || "User"}</p>
                                    <p className="text-sm text-gray-700 mt-1">{review.comment || <i>No comment</i>}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-yellow-500 text-sm mb-2">
                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                    </p>
                                    {(currentUser?.id === review.user_id || userRole === 'Admin') && (

                                        <div className="flex gap-2 justify-end">
                                            <TButton
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={() => {
                                                    setEditingReview(review);
                                                    setEditComment(review.comment || '');
                                                    setEditRating(review.rating);
                                                }}
                                            >
                                                Edit
                                            </TButton>
                                            <TButton
                                                size="sm"
                                                color="red"
                                                onClick={() => {
                                                    setReviewToDelete(review);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <TrashIcon className="w-4 h-4 mr-1" />
                                                Delete
                                            </TButton>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editingReview?.id === review.id && (
                                <ReviewEditor
                                    editingReview={editingReview}
                                    initialRating={editRating}
                                    initialComment={editComment}
                                    onSave={async ({ id, rating, comment }) => {
                                        try {
                                            await axiosClient.put(`/reviews/${id}`, { rating, comment });
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
                            )}
                        </div>
                    ))
                )}
            </div>
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Delete Review"
                message="Are you sure you want to delete your review? This action cannot be undone."
                onConfirm={confirmDelete}
            />
        </PageComponent>
    );
}
