import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, updateUser, deleteUser, assignUnits } from '../services/userService';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
};

export const useAssignUnits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, unitIds }: { id: string; unitIds: string[] }) => assignUnits(id, unitIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
};