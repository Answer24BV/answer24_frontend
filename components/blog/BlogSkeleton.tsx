import { Skeleton } from "@/components/ui/skeleton";

const BlogSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Featured Post Skeleton */}
        <div className="md:col-span-2 lg:row-span-2">
          <div className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border">
            <Skeleton className="relative aspect-video w-full" />
            <div className="p-6 flex-1 flex flex-col">
              <Skeleton className="h-4 w-1/4 mb-3" />
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="mt-auto pt-4 flex items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-1/4 ml-2" />
                <Skeleton className="h-8 w-24 ml-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Other Posts Skeletons */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="group">
            <div className="h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border">
              <Skeleton className="relative aspect-video w-full" />
              <div className="p-5 flex-1 flex flex-col">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="mt-auto pt-3 flex items-center text-xs text-muted-foreground">
                  <Skeleton className="h-4 w-1/3" />
                  <span className="mx-1.5">•</span>
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* More Articles Skeletons */}
      <div className="mb-16">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="group">
              <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border">
                <Skeleton className="relative aspect-[16/9] w-full" />
                <div className="p-5">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
