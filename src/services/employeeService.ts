// ... existing imports ...
import { apiClient } from '../api/axios';
import { type EmployeeStatus } from '../types/employee';

// ... existing GET functions ...

export const updateEmployeeStatus = async ({ id, status }: { id: string; status: EmployeeStatus }) => {
  const { data } = await apiClient.patch('/employee/status', { id, status });
  return data;
};

export const assignEmployeeCode = async ({ id, employeeCode }: { id: string; employeeCode: string }) => {
  const { data } = await apiClient.patch('/employee/code', { id, employeeCode });
  return data;
};