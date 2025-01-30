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

  const getUserId = (userId: any): string => {
    if (!userId) return "";
    if (typeof userId === "string") return userId;
    if (typeof userId === "object" && "_id" in userId)
      return userId._id.toString();
    if (typeof userId?.toString === "function") return userId.toString();
    return "";
  };

  // Safer debug logging
  console.log("Session user ID:", session?.user?.id);
  console.log(
    "Reviews:",
    reviews.map((r) => ({
      reviewId: r._id?.toString() || "",
      userId: getUserId(r.userId),
      raw: r.userId,
    }))
  );

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const reviewUserId = getUserId(review.userId);
        const sessionUserId = session?.user?.id || "";
        // Explicitly convert to boolean
        const isOwner = Boolean(
          sessionUserId && reviewUserId && sessionUserId === reviewUserId
        );

        // Safer debug logging
        console.log("Is owner check:", {
          sessionUserId,
          reviewUserId,
          isOwner,
        });

        return (
          <ReviewItem
            key={review._id?.toString() || Math.random().toString()}
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
