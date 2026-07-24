import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, resetAdminPassword } from '../services/adminService';

export const useAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: getAdmins,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] })
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateAdmin(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] })
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] })
  });
};

export const useResetAdminPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => resetAdminPassword(id, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admins'] })
  });
};