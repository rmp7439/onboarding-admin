import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { type ReportFilters } from "../../../services/reportService";

interface FilterPanelProps {
  filters: ReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilters>>;
  onApply: () => void;
  onReset: () => void;
  units: string[];
}

export function FilterPanel({ filters, setFilters, onApply, onReset, units }: FilterPanelProps) {
  const handleChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label htmlFor="status">Employee Status</Label>
          <Select id="status" value={filters.status || "ALL"} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select id="unit" value={filters.unit || "ALL"} onChange={(e) => handleChange('unit', e.target.value)}>
            <option value="ALL">All Units</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex items-center space-x-2">
            <Input 
              type="date" 
              value={filters.startDate || ""} 
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="text-gray-600"
            />
            <span className="text-gray-400">-</span>
            <Input 
              type="date" 
              value={filters.endDate || ""} 
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="text-gray-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input 
            id="search" 
            placeholder="Name or Code..." 
            value={filters.search || ""}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onReset}>Reset Filters</Button>
        <Button onClick={onApply}>Apply Filters</Button>
      </div>
    </div>
  );
}