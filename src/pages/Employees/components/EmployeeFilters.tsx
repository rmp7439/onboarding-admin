import { RefreshCw, Search, CalendarDays } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Label } from "../../../components/ui/Label";

interface EmployeeFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  joiningDate: string;
  setJoiningDate: (val: string) => void;
  onRefresh: () => void;
}

export function EmployeeFilters({
  searchQuery,
  setSearchQuery,
  joiningDate,
  setJoiningDate,
  onRefresh,
}: EmployeeFiltersProps) {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-end justify-between gap-4">
      <div className="flex flex-1 items-end gap-4">
        
        <div className="space-y-2 w-96">
          <Label htmlFor="code" className="text-gray-700 font-medium">
            Employee Code
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Search employees..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 w-96">
          <Label htmlFor="date" className="text-gray-700 font-medium">
            Date of Joining
          </Label>
          <div className="relative">
            <CalendarDays className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="date"
              type="date"
              className="pl-9 text-gray-600"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>
        </div>

      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4 text-gray-500" />
          Refresh
        </Button>
      </div>
    </div>
  );
}