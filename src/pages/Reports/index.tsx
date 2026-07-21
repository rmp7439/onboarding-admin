import { useState } from "react";
import { ReportCard } from "./components/ReportCard";
import { DownloadButton } from "./components/DownloadButton";
import { ReportEmptyState } from "./components/ReportEmptyState";
import { FilterPanel } from "./components/FilterPanel";
import { useReportEmployees } from "../../hooks/useReportEmployees";
import { useExportExcel, triggerDownload, useExportBulkPdf} from "../../hooks/useReports";
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

  const handleReset = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleDownloadAllPdfs = async () => {
    if (!hasValidFilter) {
      toast("Please apply a filter before exporting individual reports.", "info");
      return;
    }

    if (!reportEmployees.length) return;
    
    setIsDownloadingPdfs(true);
    try {
      // Process downloads sequentially to avoid overwhelming the browser/backend
      for (const emp of reportEmployees) {
        const blob = await downloadEmployeePdf(emp.id);
        
        // Format name: replace invalid filename chars, then replace spaces with underscores
        const rawName = `${emp.firstName || ''} ${emp.surname || ''}`.trim();
        const sanitizedName = rawName
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid OS characters
          .replace(/\s+/g, '_');                 // Replace spaces with underscores
          
        const filename = `${sanitizedName}_Report.pdf`;
        
        triggerDownload(blob, filename);
        
        // Slight delay to ensure the browser registers separate file downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      toast(`Successfully downloaded ${reportEmployees.length} PDFs.`, "success");
    } catch (error) {
      toast("Failed to download one or more PDFs.", "error");
    } finally {
      setIsDownloadingPdfs(false);
    }
  };

  const handleBulkPdf = () => {
    if (!hasValidFilter) {
      toast("Please apply a filter before generating a Bulk PDF.", "info");
      return;
    }
    
    if (reportEmployees.length === 0) {
      toast("No employees found for the selected filter.", "info");
      return;
    }

    if (reportEmployees.length === 1) {
      toast("Bulk PDF is available only when multiple employees are returned. Use Individual PDF instead.", "info");
      return;
    }
    
    exportBulkPdfMutation.mutate(appliedFilters);
  };

  return (
    <div className="space-y-6 pb-8">
      <FilterPanel 
        filters={filters} 
        setFilters={setFilters} 
        onApply={() => setAppliedFilters(filters)} 
        onReset={handleReset} 
      />

      {/* Results Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Filter Results</h2>
        <div className="text-gray-600 font-medium">
          {!hasValidFilter ? (
            "No filter applied"
          ) : (
            `Found ${reportEmployees.length} employee${reportEmployees.length !== 1 ? 's' : ''}`
          )}
        </div>
      </div>

      {!isLoading && hasValidFilter && reportEmployees.length === 0 ? (
        <ReportEmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <li>Unit & Phone Number</li>
                <li>Status & Joining Date</li>
                <li>Document Hyperlinks</li>
              </ul>
            </div>
          </ReportCard>

          <ReportCard 
            title="PDF Report (Individual)" 
            action={
              <DownloadButton 
                label="Download Individual Reports" 
                onClick={handleDownloadAllPdfs} 
                isLoading={isDownloadingPdfs} 
                disabled={!hasValidFilter}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              />
            }
          >
            <div className="text-sm text-gray-600">
               <p className="font-medium text-gray-900 mb-2">
                Action Summary:
              </p>
              <p>
                Generates a separate PDF profile for every employee currently visible in your filtered results.
              </p>
            </div>
          </ReportCard>

          <ReportCard 
            title="Bulk PDF Report" 
            action={
              <DownloadButton 
                label="Download Bulk PDF" 
                onClick={handleBulkPdf} 
                isLoading={exportBulkPdfMutation.isPending} 
                disabled={!hasValidFilter || reportEmployees.length<=1}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
              />
            }
          >
            <div className="text-sm text-gray-600">
               <p className="font-medium text-gray-900 mb-2">
                Action Summary:
              </p>
              <p>
                Generates a single merged PDF document containing profiles for every employee in your filtered results.
              </p>
            </div>
          </ReportCard>
        </div>
      )}
    </div>
  );
}