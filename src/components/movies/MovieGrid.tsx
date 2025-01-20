"use client";

import type { Movie } from "@/types/movie";

interface MovieGridProps {
  children: React.ReactNode;
}

export default function MovieGrid({ children }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {children}
    </div>
  );
}
