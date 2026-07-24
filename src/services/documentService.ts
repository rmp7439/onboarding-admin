import { apiClient } from '../api/axios';

export const downloadEmployeeDocument = async (documentId: string): Promise<Blob> => {
  const response = await apiClient.get(`/document/${documentId}/download`, { responseType: 'blob' });
  return response.data;
};

export const downloadEmployeeSelfie = async (employeeId: string): Promise<Blob> => {
  const response = await apiClient.get(`/employee/${employeeId}/selfie/download`, { responseType: 'blob' });
  return response.data;
};

export const downloadMergedDocument = async (employeeId: string, type: string): Promise<Blob> => {
  const response = await apiClient.get(`/employee/${employeeId}/document/${type}/merged`, { 
    responseType: 'blob' 
  });
  return response.data;
};