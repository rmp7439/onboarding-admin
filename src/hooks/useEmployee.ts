import { useQuery } from '@tanstack/react-query';
import { getEmployeeById } from '../services/employeeService';
import { type EmployeeDetailsData } from '../types/employee';

export const useEmployee = (id: string | undefined) => {
  return useQuery<EmployeeDetailsData, Error>({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id as string),
    enabled: !!id,
    retry: 1,
  });
};