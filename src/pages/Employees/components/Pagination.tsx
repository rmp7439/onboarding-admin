import { Button } from "../../../components/ui/Button";

export function Pagination() {
  return (
    <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" className="h-8 px-3">
          Previous
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-gray-100 text-gray-900 border-gray-300">
          1
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          2
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          3
        </Button>
        <Button variant="outline" size="sm" className="h-8 px-3">
          Next
        </Button>
      </div>
    </div>
  );
}