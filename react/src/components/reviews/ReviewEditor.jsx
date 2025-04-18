import { useState } from "react";
import TButton from "../core/TButton";

export default function ReviewEditor({
    editingReview,
    initialRating = 0,
    initialComment = "",
    onSave,
    onCancel
}) {
    const [editRating, setEditRating] = useState(initialRating);
    const [editComment, setEditComment] = useState(initialComment);
    const [hoveredRating, setHoveredRating] = useState(0);

    return (
        <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-semibold mb-2">
                {editingReview ? "Edit Your Review" : "Leave a Review"}
            </h4>
            <div className="flex items-center gap-1 mb-2">
                <label htmlFor="editRating" className="text-sm font-medium mr-2">
                    Rating:
                </label>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`text-2xl transition-colors ${(hoveredRating || editRating) >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                            }`}
                        onClick={() => setEditRating(star)}
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
                placeholder="Update your comment..."
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
            />
            <div className="flex gap-2">
                <TButton
                    onClick={() =>
                        onSave({
                            ...(editingReview ? { id: editingReview.id } : {}),
                            rating: editRating,
                            comment: editComment
                        })
                    }
                >
                    Save
                </TButton>

                <TButton
                    className="bg-gray-300 text-black hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Cancel
                </TButton>
            </div>
        </div>
    );
}