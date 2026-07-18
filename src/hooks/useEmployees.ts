import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../services/employeeService';
import { type Employee } from '../types/employee';

export const useEmployees = (search?: string) => {
  return useQuery<Employee[], Error>({
    queryKey: ['employees', search],
    queryFn: () => getEmployees(search),
  });
};