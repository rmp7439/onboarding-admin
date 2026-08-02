import { useState } from "react";
import { ReportCard } from "./components/ReportCard";
import { DownloadButton } from "./components/DownloadButton";
import { ReportEmptyState } from "./components/ReportEmptyState";
import { FilterPanel } from "./components/FilterPanel";
import { useReportEmployees } from "../../hooks/useReportEmployees";
import { useExportExcel, triggerDownload, useExportBulkPdf } from "../../hooks/useReports";
import { type ReportFilters, downloadEmployeePdf } from "../../services/reportService";
import { useToast } from "../../hooks/useToast";

const initialFilters: ReportFilters = { day: "", month: "", year: "", unit: "", userId: "" };

export default function Reports() {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<ReportFilters>(initialFilters);
  const [isDownloadingPdfs, setIsDownloadingPdfs] = useState(false);

  const hasValidFilter = !!(appliedFilters.year || appliedFilters.month || appliedFilters.day || appliedFilters.unit || appliedFilters.userId);

  const exportBulkPdfMutation = useExportBulkPdf();
  const { data: reportEmployees = [], isLoading } = useReportEmployees(appliedFilters);
  const exportExcelMutation = useExportExcel();
  const { toast } = useToast();

  const handleReset = () => { setFilters(initialFilters); setAppliedFilters(initialFilters); };

  const handleDownloadAllPdfs = async () => {
    if (!hasValidFilter) { toast("Please apply a filter before exporting individual reports.", "info"); return; }
    if (!reportEmployees.length) return;

    setIsDownloadingPdfs(true);
    try {
      for (const emp of reportEmployees) {
        const blob = await downloadEmployeePdf(emp.id);
        const rawName = `${emp.firstName || ""} ${emp.surname || ""}`.trim();
        const sanitizedName = rawName.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").replace(/\s+/g, "_");
        const filename = `${sanitizedName}_Report.pdf`;

        triggerDownload(blob, filename);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      toast(`Successfully downloaded ${reportEmployees.length} PDFs.`, "success");
    } catch (error) {
      toast("Failed to download one or more PDFs.", "error");
    } finally {
      setIsDownloadingPdfs(false);
    }
  };

  const handleBulkPdf = () => {
    if (!hasValidFilter) { toast("Please apply a filter before generating a Bulk PDF.", "info"); return; }
    if (reportEmployees.length === 0) { toast("No employees found for the selected filter.", "info"); return; }
    if (reportEmployees.length === 1) { toast("Bulk PDF is available only when multiple employees are returned. Use Individual PDF instead.", "info"); return; }
    exportBulkPdfMutation.mutate(appliedFilters);
  };

  return (
    <div className="space-y-6 pb-8">
      <FilterPanel filters={filters} setFilters={setFilters} onApply={() => setAppliedFilters(filters)} onReset={handleReset} />

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Filter Results</h2>
        <div className="text-gray-600 dark:text-slate-400 font-medium">
          {!hasValidFilter ? "No filter applied" : `Found ${reportEmployees.length} employee${reportEmployees.length !== 1 ? "s" : ""}`}
        </div>
      </div>

      {!isLoading && hasValidFilter && reportEmployees.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReportCard
            title="Excel Report"
            action={<DownloadButton label="Export Excel" onClick={() => exportExcelMutation.mutate(appliedFilters)} isLoading={exportExcelMutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" />}
          />
          <ReportCard
            title="PDF Report"
            action={<DownloadButton label="Download Individual Reports" onClick={handleDownloadAllPdfs} isLoading={isDownloadingPdfs} disabled={!hasValidFilter} className="w-full bg-blue-600 hover:bg-blue-700 text-white" />}
          />
          <ReportCard
            title="Bulk PDF Report"
            action={<DownloadButton label="Download Bulk PDF" onClick={handleBulkPdf} isLoading={exportBulkPdfMutation.isPending} disabled={!hasValidFilter || reportEmployees.length <= 1} className="w-full bg-purple-600 hover:bg-purple-700 text-white" />}
          />
        </div>
      )}
    </div>
  );
}