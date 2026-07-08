import { Skeleton } from "../../../components/ui/Skeleton";

export function EmployeeDetailsSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex items-start gap-6">
        <div className="w-[70%] space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-[30%] space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}