import { Skeleton } from "@/components/ui/skeleton";

export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="fixed top-1 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-24 h-5" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="w-24 h-9 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Skeleton className="w-48 h-8 mx-auto rounded-full" />
          <div className="space-y-4">
            <Skeleton className="w-full max-w-2xl h-12 mx-auto" />
            <Skeleton className="w-full max-w-xl h-12 mx-auto" />
            <Skeleton className="w-full max-w-lg h-12 mx-auto" />
          </div>
          <Skeleton className="w-full max-w-md h-6 mx-auto" />
          <Skeleton className="w-48 h-14 mx-auto rounded-xl" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-card">
              <Skeleton className="w-12 h-12 rounded-xl mb-4" />
              <Skeleton className="w-3/4 h-6 mb-2" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
