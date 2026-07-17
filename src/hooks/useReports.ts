import { useMutation } from '@tanstack/react-query';
import { exportEmployeeExcel, downloadEmployeePdf, type ReportFilters } from '../services/reportService';
import { useToast } from './useToast';

// Helper utility to trigger browser download
export const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const useExportExcel = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (filters: ReportFilters) => exportEmployeeExcel(filters),
    onSuccess: (blob) => {
      triggerDownload(blob, `Employee_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast("Excel report downloaded successfully.", "success");
    },
    onError: (error: unknown) => {
      const isAxiosError = (err: any): err is { response?: { data?: { message?: string } } } => !!err.isAxiosError;
      const msg = (isAxiosError(error) && error.response?.data?.message) 
        || (error instanceof Error ? error.message : "Failed to generate Excel report.");
      toast(msg, "error");
    }
  });
};

export const useDownloadPdf = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (employeeId: string) => downloadEmployeePdf(employeeId),
    onSuccess: (blob) => {
      triggerDownload(blob, `Employee_Profile_${new Date().getTime()}.pdf`);
      toast("PDF report downloaded successfully.", "success");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to generate PDF report.";
      toast(msg, "error");
    }
  });
};