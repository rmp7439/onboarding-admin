import { FileSearch } from "lucide-react";

export function ReportEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center border border-gray-200 rounded-xl bg-white shadow-sm w-full">
      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <FileSearch className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No employees match filters</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        We couldn't find any employee records matching your current filter criteria. Try adjusting the filters to generate a report.
      </p>
    </div>
  );
}