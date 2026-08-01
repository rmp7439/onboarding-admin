import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Ensure we always show at least 1 page
  const total = Math.max(1, totalPages);
  
  // Create a sliding window of up to 5 visible page numbers
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
    <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
      <div className="flex items-center space-x-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3"
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
            className={`h-8 w-8 p-0 ${page === currentPage ? "bg-gray-100 text-gray-900 border-gray-300" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3"
          disabled={currentPage >= total}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}