import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ListingCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="flex flex-col md:flex-row h-full">
      {/* Image area — matches ListingCard md:w-[55%] */}
      <div className="relative w-full md:w-[55%] aspect-[4/3] md:aspect-square">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="md:hidden absolute bottom-2.5 left-2.5">
          <Skeleton className="h-7 w-20 rounded-lg" />
        </div>
      </div>
      {/* Content area — matches ListingCard md:w-[45%] */}
      <div className="w-full md:w-[45%] p-3.5 md:p-3 flex flex-col justify-between gap-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="hidden md:block h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  </Card>
);

export default ListingCardSkeleton;
