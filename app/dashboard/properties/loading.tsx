import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Komponen ini akan ditampilkan secara otomatis oleh Next.js
export default function PropertiesLoading() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b pb-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardFooter className="flex justify-between items-center bg-gray-50/50 p-4">
              <Skeleton className="h-4 w-1/3" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-10" />
                <Skeleton className="h-9 w-10" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
