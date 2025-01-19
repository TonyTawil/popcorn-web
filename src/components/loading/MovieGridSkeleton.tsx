const MovieGridSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-700 aspect-[2/3] rounded-lg"></div>
          <div className="bg-gray-700 h-4 w-3/4 mt-2 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default MovieGridSkeleton;
