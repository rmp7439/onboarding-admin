import { Search, RefreshCw } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { mockUnits } from "../mockData";

interface EmployeeFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  unitFilter: string;
  setUnitFilter: (val: string) => void;
}

export function EmployeeFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  unitFilter,
  setUnitFilter,
}: EmployeeFiltersProps) {
  return (
    <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, code, or phone..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Select>

        <Select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="w-48">
          <option value="ALL">All Units</option>
          {mockUnits.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </Select>
      </div>

      <Button variant="outline" className="ml-4" onClick={() => {}}>
        <RefreshCw className="mr-2 h-4 w-4 text-gray-500" />
        Refresh
      </Button>
    </div>
  );
}