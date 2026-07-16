import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { type ReportFilters } from "../../../services/reportService";

interface FilterPanelProps {
  filters: ReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilters>>;
  onApply: () => void;
  onReset: () => void;
}

const MONTHS = [
  { value: "1", label: "January" }, { value: "2", label: "February" },
  { value: "3", label: "March" }, { value: "4", label: "April" },
  { value: "5", label: "May" }, { value: "6", label: "June" },
  { value: "7", label: "July" }, { value: "8", label: "August" },
  { value: "9", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" }
];

export function FilterPanel({ filters, setFilters, onApply, onReset }: FilterPanelProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  const handleChange = (key: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Select 
            id="month"
            value={filters.month || ""}
            onChange={(e) => handleChange('month', e.target.value)}
          >
            <option value="">All Months</option>
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select 
            id="year"
            value={filters.year || ""}
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </div>

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
          <Label htmlFor="joiningDate">Exact Joining Date</Label>
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