import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { type ReportFilters } from "../../../services/reportService";

interface FilterPanelProps {
  filters: ReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilters>>;
  onApply: () => void;
  onReset: () => void;
}

export function FilterPanel({ filters, setFilters, onApply, onReset }: FilterPanelProps) {
  const handleChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code">Employee Code</Label>
          <Input 
            id="code" 
            placeholder="e.g. EMP-123" 
            value={filters.code || ""}
            onChange={(e) => handleChange('code', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Employee Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. John Doe" 
            value={filters.name || ""}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="joiningDate">Date of Joining</Label>
          <Input 
            id="joiningDate" 
            type="date" 
            value={filters.joiningDate || ""} 
            onChange={(e) => handleChange('joiningDate', e.target.value)}
            className="text-gray-600"
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