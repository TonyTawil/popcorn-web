"use client";

import { useSession } from "next-auth/react";
import ReviewItem from "./ReviewItem";
import type { IReview } from "@/models/Review";

interface ReviewListProps {
  reviews: IReview[];
  onDelete: (reviewId: string) => void;
  onUpdate: (review: IReview) => void;
}

export default function ReviewList({
  reviews,
  onDelete,
  onUpdate,
}: ReviewListProps) {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem
          key={review._id.toString()}
          review={review}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isOwner={review.userId.toString() === session?.user?.id}
        />
      ))}
    </div>
  );
}
