import { useState } from "react";
import { ReportCard } from "./components/ReportCard";
import { DownloadButton } from "./components/DownloadButton";
import { ReportEmptyState } from "./components/ReportEmptyState";
import { FilterPanel } from "./components/FilterPanel";
import { useReportEmployees } from "../../hooks/useReportEmployees";
import { useExportExcel, useDownloadPdf } from "../../hooks/useReports";
import { type ReportFilters } from "../../services/reportService";

const initialFilters: ReportFilters = { code: "", joiningDate: "", month: "", year: "" };

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(initialFilters);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const { data: reportEmployees = [], isLoading } = useReportEmployees(appliedFilters);
  const exportExcelMutation = useExportExcel();
  const downloadPdfMutation = useDownloadPdf();

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSelectedEmployeeId("");
  };

  return (
    <div className="space-y-8 pb-8">
      <FilterPanel 
        filters={filters} 
        setFilters={setFilters} 
        onApply={() => setAppliedFilters(filters)} 
        onReset={handleReset} 
      />

      {!isLoading && reportEmployees.length === 0 ? (
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
                <li>Document Hyperlinks</li>
              </ul>
            </div>
          </ReportCard>

          <ReportCard 
            title="Employee PDF Report" 
            action={
              <DownloadButton 
                label="Generate PDF" 
                onClick={() => selectedEmployeeId && downloadPdfMutation.mutate(selectedEmployeeId)} 
                isLoading={downloadPdfMutation.isPending} 
                disabled={!selectedEmployeeId} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              />
            }
          >
            <div className="space-y-3">
              <label htmlFor="employeeSelect" className="text-gray-900 font-medium text-sm">
                Select Employee
              </label>
              <select 
                id="employeeSelect"
                className="flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50" 
                value={selectedEmployeeId} 
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
              >
                <option value="" disabled>-- Select an Employee --</option>
                {reportEmployees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.surname} {emp.employeeCode ? `(${emp.employeeCode})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </ReportCard>
        </div>
      )}
    </div>
  );
}