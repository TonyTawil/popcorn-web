"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import type { IReview } from "@/models/Review";

interface ReviewFormProps {
  movieId: number;
  onSubmit: (review: IReview) => void;
  onCancel: () => void;
  initialData?: {
    rating: number;
    reviewText: string;
    reviewId: string;
  };
  isEditing?: boolean;
}

export default function ReviewForm({
  movieId,
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [reviewText, setReviewText] = useState(initialData?.reviewText || "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const url = isEditing ? `/api/reviews` : "/api/reviews";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? { reviewId: initialData?.reviewId, rating, reviewText }
        : { movieId, rating, reviewText };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (star: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const halfStar = x < rect.width / 2;
    const newRating = halfStar ? star - 0.5 : star;
    setRating(newRating);
    setHoveredRating(0); // Reset hover state when clicking
  };

  const handleStarHover = (star: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const halfStar = x < rect.width / 2;
    setHoveredRating(halfStar ? star - 0.5 : star);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-6 rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={(e) => handleStarClick(star, e)}
              onMouseMove={(e) => handleStarHover(star, e)}
              onMouseLeave={() => setHoveredRating(0)}
              className="relative focus:outline-none w-8 h-8"
            >
              <div className="relative w-8 h-8">
                <StarOutlineIcon
                  className="h-8 w-8 text-yellow-400"
                  style={{ position: "absolute", zIndex: 10 }}
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: `${getStarFillPercentage(
                      star,
                      hoveredRating || rating
                    )}%`,
                    zIndex: 20,
                  }}
                >
                  <StarIcon className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
        <span className="text-gray-400 mt-1 block">
          {(hoveredRating || rating).toFixed(1)} out of 5 stars
        </span>
      </div>

      <div className="mb-4">
        <label htmlFor="reviewText" className="block text-gray-300 mb-2">
          Review (optional)
        </label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          rows={4}
          placeholder="Write your thoughts about the movie..."
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </button>
      </div>
    </form>
  );
}

function getStarFillPercentage(star: number, rating: number): number {
  if (rating >= star) return 100;
  if (rating < star - 1) return 0;
  return (rating % 1) * 100;
}
