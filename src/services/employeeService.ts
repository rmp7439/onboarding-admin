import { apiClient } from '../api/axios';
import { type Employee, type EmployeeDetailsData } from '../types/employee';

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await apiClient.get('/employees');
  return data;
};

export const getEmployeeById = async (id: string): Promise<EmployeeDetailsData> => {
  const { data } = await apiClient.get(`/employee/${id}`);
  return data;
};