"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import type { IReview } from "@/models/Review";

interface ReviewSectionProps {
  movieId: number;
}

export default function ReviewSection({ movieId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?movieId=${movieId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setReviews(data);
      setUserHasReviewed(
        data.some(
          (review: IReview) => review.userId.toString() === session?.user?.id
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (newReview: IReview) => {
    setReviews([newReview, ...reviews]);
    setUserHasReviewed(true);
    setShowForm(false);
  };

  const handleReviewDelete = async (reviewId: string) => {
    setReviews(reviews.filter((review) => review._id !== reviewId));
    setUserHasReviewed(false);
  };

  const handleReviewUpdate = async (updatedReview: IReview) => {
    setReviews(
      reviews.map((review) =>
        review._id === updatedReview._id ? updatedReview : review
      )
    );
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Reviews</h2>
          <div className="flex items-center mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(averageRating) ? (
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="h-5 w-5 text-yellow-400" />
                  )}
                </span>
              ))}
            </div>
            <span className="ml-2 text-gray-400">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
        {session && !userHasReviewed && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          movieId={movieId}
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="text-center text-gray-400">Loading reviews...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <ReviewList
          reviews={reviews}
          onDelete={handleReviewDelete}
          onUpdate={handleReviewUpdate}
        />
      )}
    </section>
  );
}
