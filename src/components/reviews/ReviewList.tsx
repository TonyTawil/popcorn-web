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

  // Add console.log to debug the values
  console.log("Session user ID:", session?.user?.id);
  console.log(
    "Reviews:",
    reviews.map((r) => ({
      reviewId: r._id,
      userId: r.userId,
      userIdString: r.userId.toString(),
    }))
  );

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isOwner = session?.user?.id === review.userId.toString();
        console.log("Is owner check:", {
          sessionUserId: session?.user?.id,
          reviewUserId: review.userId.toString(),
          isOwner,
        });

        return (
          <ReviewItem
            key={review._id.toString()}
            review={review}
            onDelete={onDelete}
            onUpdate={onUpdate}
            isOwner={isOwner}
          />
        );
      })}
    </div>
  );
}
