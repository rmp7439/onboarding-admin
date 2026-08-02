import { FileSearch } from "lucide-react";

export function ReportEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm w-full transition-colors">
      <div className="h-16 w-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-colors">
        <FileSearch className="h-8 w-8 text-gray-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">No matching records found.</h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-sm">
        We couldn't find any employee records matching your current filter criteria. Try adjusting the filters to generate a report.
      </p>
    </div>
  );
}