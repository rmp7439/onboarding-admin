import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployeeStatus, assignEmployeeCode } from '../services/employeeService';
import { type EmployeeStatus } from '../types/employee';

export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EmployeeStatus }) => 
      updateEmployeeStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee'] });
    },
  });
};

export const useAssignEmployeeCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, employeeCode }: { id: string; employeeCode: string }) => 
      assignEmployeeCode({ id, employeeCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee'] });
    },
  });
};