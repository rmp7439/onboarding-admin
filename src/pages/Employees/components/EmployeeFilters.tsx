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
    <div className="bg-white dark:bg-slate-900 p-4 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm flex items-end justify-between gap-4 transition-colors">
      <div className="flex flex-1 items-end gap-4">
        
        <div className="space-y-2 w-96">
          <Label htmlFor="search">Employee Code</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-slate-400" />
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
          <Label htmlFor="date">Date of Joining</Label>
          <div className="relative">
            <CalendarDays className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-slate-400" />
            <Input
              id="date"
              type="date"
              className="pl-9"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>
        </div>

      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4 text-gray-500 dark:text-slate-400" />
          Refresh
        </Button>
      </div>
    </div>
  );
}