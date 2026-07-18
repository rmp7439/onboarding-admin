import { apiClient } from '../api/axios';

export interface ReportFilters {
  day?: string;
  month?: string;
  year?: string;
}

export const exportEmployeeExcel = async (filters: ReportFilters): Promise<Blob> => {
  const response = await apiClient.get('/export/excel', { 
    params: filters, 
    responseType: 'blob' // Essential for receiving binary files over Axios
  });
  return response.data;
};

export const downloadEmployeePdf = async (employeeId: string): Promise<Blob> => {
  const response = await apiClient.get(`/employee/${employeeId}/pdf`, { 
    responseType: 'blob' 
  });
  return response.data;
};

export const exportBulkPdf = async (filters: ReportFilters): Promise<Blob> => {
  const response = await apiClient.get('/export/pdf/bulk', { 
    params: filters, 
    responseType: 'blob' 
  });
  return response.data;
};