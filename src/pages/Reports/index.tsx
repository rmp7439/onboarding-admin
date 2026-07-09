import { useState, useMemo } from "react";
import { ReportCard } from "./components/ReportCard";
import { DownloadButton } from "./components/DownloadButton";
import { ReportEmptyState } from "./components/ReportEmptyState";
import { Search, CalendarDays } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useEmployees } from "../../hooks/useEmployees";
import { useExportExcel, useDownloadPdf } from "../../hooks/useReports";
import { type ReportFilters } from "../../services/reportService";

const initialFilters: ReportFilters = {
  code: "",
  joiningDate: "",
};

export default function Reports() {
  const { data: employees = [], isLoading: isLoadingEmployees } =
    useEmployees();
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<ReportFilters>(initialFilters);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const exportExcelMutation = useExportExcel();
  const downloadPdfMutation = useDownloadPdf();

  // Client-side filtering check
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const filterCode = appliedFilters.code?.trim().toLowerCase() || "";
      const filterDate = appliedFilters.joiningDate?.trim() || "";

      const matchCode =
        !filterCode || emp.code?.toLowerCase().includes(filterCode);
      const matchDate = !filterDate || emp.joiningDate === filterDate;

      return matchCode && matchDate;
    });
  }, [employees, appliedFilters]);

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSelectedEmployeeId("");
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex items-end justify-between gap-4">
        <div className="flex flex-1 items-end gap-4">
          <div className="space-y-2 w-96">
            <Label htmlFor="reportEmployeeCode" className="text-gray-700 font-medium">
              Employee Code
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="reportEmployeeCode"
                placeholder="Enter employee code"
                className="pl-9"
                value={filters.code}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2 w-96">
            <Label htmlFor="reportJoiningDate" className="text-gray-700 font-medium">
              Date of Joining
            </Label>
            <div className="relative">
              <CalendarDays className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="reportJoiningDate"
                type="date"
                className="pl-9"
                value={filters.joiningDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, joiningDate: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={() => setAppliedFilters(filters)}>Apply Filters</Button>
        </div>
      </div>

      {!isLoadingEmployees && filteredEmployees.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <ReportCard
            title="Employee Excel Report"
            action={
              <DownloadButton
                label="Export Excel"
                onClick={() => exportExcelMutation.mutate(appliedFilters)}
                isLoading={exportExcelMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              />
            }
          >
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-2">
                Included Columns:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Employee Code</li>
                <li>Employee Name</li>
                <li>Unit</li>
                <li>Phone Number</li>
                <li>Status & Joining Date</li>
              </ul>
            </div>
          </ReportCard>

          <ReportCard
            title="Employee PDF Report"
            action={
              <DownloadButton
                label="Generate PDF"
                onClick={() =>
                  selectedEmployeeId &&
                  downloadPdfMutation.mutate(selectedEmployeeId)
                }
                isLoading={downloadPdfMutation.isPending}
                disabled={!selectedEmployeeId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              />
            }
          >
            <div className="space-y-3">
              <Label
                htmlFor="employeeSelect"
                className="text-gray-900 font-medium"
              >
                Select Employee
              </Label>
              <Select
                id="employeeSelect"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="" disabled>
                  -- Select an Employee --
                </option>
                {filteredEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} {emp.code ? `(${emp.code})` : ""}
                  </option>
                ))}
              </Select>
            </div>
          </ReportCard>
        </div>
      )}
    </div>
  );
}