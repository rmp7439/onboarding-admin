import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const total = Math.max(1, totalPages);
  
  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-b-xl transition-colors duration-200">
      <div className="flex items-center space-x-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        
        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "outline" : "ghost"}
            size="sm"
            className={`h-8 w-8 p-0 ${
              page === currentPage 
                ? "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-600 font-semibold" 
                : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          disabled={currentPage >= total}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}