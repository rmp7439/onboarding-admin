import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { type ReportFilters } from "../../../services/reportService";
import { useUnits } from "../../../hooks/useUnits";
import { useUsers } from "../../../hooks/useUsers";

interface FilterPanelProps {
  filters: ReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<ReportFilters>>;
  onApply: () => void;
  onReset: () => void;
}

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function FilterPanel({
  filters,
  setFilters,
  onApply,
  onReset,
}: FilterPanelProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1997 + 1 }, (_, i) =>
    (currentYear - i).toString(),
  );
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const { data: units = [] } = useUnits();
  const { data: users = [] } = useUsers();

  const handleChange = (key: keyof ReportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isInvalid =
    (filters.day && (!filters.month || !filters.year)) ||
    (filters.month && !filters.year);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="space-y-2">
          <Label htmlFor="day">Day</Label>
          <Select
            id="day"
            value={filters.day || ""}
            onChange={(e) => handleChange("day", e.target.value)}
          >
            <option value="">All Days</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Select
            id="month"
            value={filters.month || ""}
            onChange={(e) => handleChange("month", e.target.value)}
          >
            <option value="">All Months</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            id="year"
            value={filters.year || ""}
            onChange={(e) => handleChange("year", e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select
            id="unit"
            value={filters.unit || ""}
            onChange={(e) => handleChange("unit", e.target.value)}
          >
            <option value="">All Units</option>
            {units.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId">User</Label>
          <Select
            id="userId"
            value={filters.userId || ""}
            onChange={(e) => handleChange("userId", e.target.value)}
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
        <Button onClick={onApply} disabled={!!isInvalid}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}