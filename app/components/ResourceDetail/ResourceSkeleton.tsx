import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ResourceSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[300px] mb-4 overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            {[1, 2].map((i) => (
              <Card key={i} className="mb-4 p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 w-24" />
                </div>
                <Skeleton className="h-4 w-32 mt-2" />
              </Card>
            ))}
          </div>

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full mb-2" />
            ))}
          </div>

          <Separator className="my-4" />

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>

          <Separator className="my-4" />

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-4 w-full mb-2" />
            ))}
          </div>

          <Separator className="my-4" />

          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="w-[200px] h-[200px]" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}