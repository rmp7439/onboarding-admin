import { useState } from "react";
import { ReportCard } from "./components/ReportCard";
import { DownloadButton } from "./components/DownloadButton";
import { ReportEmptyState } from "./components/ReportEmptyState";
import { FilterPanel } from "./components/FilterPanel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Card } from "../../components/ui/Card";
import { useReportEmployees } from "../../hooks/useReportEmployees";
import { useExportExcel, useDownloadPdf } from "../../hooks/useReports";
import { downloadEmployeeDocument } from "../../services/documentService";
import { useToast } from "../../hooks/useToast";
import { type ReportFilters } from "../../services/reportService";

const initialFilters: ReportFilters = { code: "", joiningDate: "", month: "", year: "" };

const DOC_TYPES = [
  { type: 'AADHAAR', label: 'Aadhaar' },
  { type: 'PAN', label: 'PAN' },
  { type: 'DRIVING_LICENSE', label: 'Driving License' },
  { type: 'BANK_PASSBOOK', label: 'Bank Passbook' },
  { type: 'EDUCATION', label: 'Education' },
  { type: 'VOTER_ID', label: 'Voter ID' },
  { type: 'DISCHARGE_BOOK', label: 'Discharge Book' }
];

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(initialFilters);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const { data: reportEmployees = [], isLoading } = useReportEmployees(appliedFilters);
  const exportExcelMutation = useExportExcel();
  const downloadPdfMutation = useDownloadPdf();
  const { toast } = useToast();

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setSelectedEmployeeId("");
  };

  const handleOpenDoc = async (docId: string) => {
    try {
      // Reuses the existing authenticated API call from documentService
      const blob = await downloadEmployeeDocument(docId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast("Failed to open document securely.", "error");
    }
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
        <>
          <div className="grid grid-cols-2 gap-6">
            <ReportCard title="Employee Excel Report" action={
              <DownloadButton label="Export Excel" onClick={() => exportExcelMutation.mutate(appliedFilters)} isLoading={exportExcelMutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" />
            }>
               <p className="text-sm text-slate-600">
                 Export the currently filtered employee set as an Excel file for offline review and reporting.
               </p>
            </ReportCard>

            <ReportCard title="Employee PDF Report" action={
              <DownloadButton label="Generate PDF" onClick={() => selectedEmployeeId && downloadPdfMutation.mutate(selectedEmployeeId)} isLoading={downloadPdfMutation.isPending} disabled={!selectedEmployeeId} className="w-full bg-blue-600 hover:bg-blue-700 text-white" />
            }>
               <select className="w-full p-2 border rounded" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
                  <option value="" disabled>-- Select an Employee --</option>
                  {reportEmployees.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.surname} {emp.employeeCode ? `(${emp.employeeCode})` : ""}</option>
                  ))}
               </select>
            </ReportCard>
          </div>

          {/* New Results Table with Hyperlinks */}
          <Card className="shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Code</TableHead>
                  <TableHead className="font-semibold text-slate-700">Uploaded Documents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportEmployees.map((emp: any) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.firstName} {emp.surname}</TableCell>
                    <TableCell>{emp.employeeCode || "Pending"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {DOC_TYPES.map(dt => {
                          const doc = emp.documents?.find((d: any) => d.type === dt.type);
                          return doc ? (
                            <button key={dt.type} onClick={() => handleOpenDoc(doc.id)} className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium cursor-pointer">
                              {dt.label}
                            </button>
                          ) : (
                            <span key={dt.type} className="text-gray-400 text-xs">{dt.label}: Not Uploaded</span>
                          );
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
}