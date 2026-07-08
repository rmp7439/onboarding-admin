import { useState, useMemo } from "react";
import { FilterPanel } from "./components/FilterPanel";
import { ReportCard } from "./components/ReportCard";
import { DownloadButton } from "./components/DownloadButton";
import { ReportEmptyState } from "./components/ReportEmptyState";
import { Label } from "../../components/ui/Label";
import { Select } from "../../components/ui/Select";
import { useEmployees } from "../../hooks/useEmployees";
import { useExportExcel, useDownloadPdf } from "../../hooks/useReports";
import { type ReportFilters } from "../../services/reportService";

const initialFilters: ReportFilters = {
  status: "ALL",
  unit: "ALL",
  startDate: "",
  endDate: "",
  search: "",
};

export default function Reports() {
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees();
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(initialFilters);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const exportExcelMutation = useExportExcel();
  const downloadPdfMutation = useDownloadPdf();

  // Extract unique units for the dropdown dynamically
  const availableUnits = useMemo(() => {
    const units = new Set(employees.map(emp => emp.unit).filter(Boolean));
    return Array.from(units) as string[];
  }, [employees]);

  // Client-side filtering check (to determine if we should show the Empty State)
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = !appliedFilters.search || 
        emp.name?.toLowerCase().includes(appliedFilters.search.toLowerCase()) || 
        emp.code?.toLowerCase().includes(appliedFilters.search.toLowerCase());
      const matchStatus = appliedFilters.status === "ALL" || emp.status === appliedFilters.status;
      const matchUnit = appliedFilters.unit === "ALL" || emp.unit === appliedFilters.unit;
      // Note: Date filtering usually happens on the backend, but we do a basic check here for UX
      const matchStart = !appliedFilters.startDate || new Date(emp.joiningDate) >= new Date(appliedFilters.startDate);
      const matchEnd = !appliedFilters.endDate || new Date(emp.joiningDate) <= new Date(appliedFilters.endDate);

      return matchSearch && matchStatus && matchUnit && matchStart && matchEnd;
    });
  }, [employees, appliedFilters]);

  const handleApply = () => setAppliedFilters(filters);
  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSelectedEmployeeId("");
  };

  const handleExportExcel = () => {
    exportExcelMutation.mutate(appliedFilters);
  };

  const handleDownloadPdf = () => {
    if (!selectedEmployeeId) return;
    downloadPdfMutation.mutate(selectedEmployeeId);
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and download employee reports</p>
      </div>

      <FilterPanel 
        filters={filters} 
        setFilters={setFilters} 
        onApply={handleApply} 
        onReset={handleReset}
        units={availableUnits.length > 0 ? availableUnits : ["Engineering", "Sales", "Marketing", "HR"]} // Fallback to mock units if empty
      />

      {/* Show empty state if filters yield no results, otherwise show report cards */}
      {!isLoadingEmployees && filteredEmployees.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          
          {/* Card 1: Excel Report */}
          <ReportCard
            title="Employee Excel Report"
            description="Export the master list of employees based on current filters."
            action={
              <DownloadButton 
                label="Export Excel" 
                onClick={handleExportExcel} 
                isLoading={exportExcelMutation.isPending} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              />
            }
          >
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-2">Included Columns:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Employee Code</li>
                <li>Employee Name</li>
                <li>Unit</li>
                <li>Phone Number</li>
                <li>Status & Joining Date</li>
              </ul>
            </div>
          </ReportCard>

          {/* Card 2: PDF Report */}
          <ReportCard
            title="Employee PDF Report"
            description="Download a detailed, printable profile for a specific employee."
            action={
              <DownloadButton 
                label="Generate PDF" 
                onClick={handleDownloadPdf} 
                isLoading={downloadPdfMutation.isPending} 
                disabled={!selectedEmployeeId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              />
            }
          >
            <div className="space-y-3">
              <Label htmlFor="employeeSelect" className="text-gray-900 font-medium">Select Employee</Label>
              <Select 
                id="employeeSelect" 
                value={selectedEmployeeId} 
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="" disabled>-- Select an Employee --</option>
                {filteredEmployees.map(emp => (
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