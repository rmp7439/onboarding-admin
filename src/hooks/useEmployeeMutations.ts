import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployeeStatus, assignEmployeeCode } from '../services/employeeService';
import { type EmployeeStatus, type Employee, type EmployeeDetailsData } from '../types/employee';

export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, rejectReason }: { id: string; status: EmployeeStatus, rejectReason?: string}) => 
      updateEmployeeStatus({ id, status, rejectReason }),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });
      await queryClient.cancelQueries({ queryKey: ['employee', newStatus.id] });

      const previousEmployees = queryClient.getQueryData(['employees']);
      
      queryClient.setQueryData(['employees'], (old: Employee[] | undefined) => 
        old?.map(emp => emp.id === newStatus.id ? { ...emp, status: newStatus.status, rejectReason: newStatus.rejectReason } : emp)
      );

      queryClient.setQueryData(['employee', newStatus.id], (old: EmployeeDetailsData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          employmentInfo: { ...old.employmentInfo, status: newStatus.status, rejectReason: newStatus.rejectReason }
        };
      });

      return { previousEmployees };
    },
    onError: (_err, _newStatus, context) => {
      // Rollback on failure
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useAssignEmployeeCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, employeeCode }: { id: string; employeeCode: string }) => 
      assignEmployeeCode({ id, employeeCode }),
    onMutate: async (newCode) => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });
      await queryClient.cancelQueries({ queryKey: ['employee', newCode.id] });

      const previousEmployees = queryClient.getQueryData(['employees']);

      queryClient.setQueryData(['employees'], (old: Employee[] | undefined) => 
        old?.map(emp => emp.id === newCode.id ? { ...emp, code: newCode.employeeCode } : emp)
      );

      queryClient.setQueryData(['employee', newCode.id], (old: EmployeeDetailsData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          employmentInfo: { ...old.employmentInfo, code: newCode.employeeCode }
        };
      });

      return { previousEmployees };
    },
    onError: (_err, _newCode, context) => {
      if (context?.previousEmployees) {
        queryClient.setQueryData(['employees'], context.previousEmployees);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};