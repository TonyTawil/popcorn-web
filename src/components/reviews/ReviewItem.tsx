"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ReviewForm from "./ReviewForm";
import type { IReview } from "@/models/Review";

interface ReviewItemProps {
  review: IReview;
  onDelete: (reviewId: string) => void;
  onUpdate: (review: IReview) => void;
  isOwner: boolean;
}

export default function ReviewItem({
  review,
  onDelete,
  onUpdate,
  isOwner,
}: ReviewItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/reviews?reviewId=${review._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      onDelete(review._id);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      // Optionally show an error message to the user
    }
  };

  if (isEditing) {
    return (
      <ReviewForm
        movieId={review.movieId}
        initialData={{
          reviewId: review._id,
          rating: review.rating,
          reviewText: review.reviewText || "",
        }}
        onSubmit={(updatedReview) => {
          onUpdate(updatedReview);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        isEditing
      />
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          {review.reviewText && (
            <p className="text-white mt-2">{review.reviewText}</p>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Edit review"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete review"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {showConfirmDelete && (
        <div className="mt-4 p-4 bg-red-500/10 rounded-lg">
          <p className="text-white mb-4">
            Are you sure you want to delete this review?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
