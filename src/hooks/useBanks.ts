import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBanks, createBank, updateBank, deleteBank } from '../services/bankService';

export const useBanks = () => {
  return useQuery({
    queryKey: ['banks'],
    queryFn: getBanks,
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBank,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banks'] })
  });
};

export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string; isActive: boolean } }) => updateBank(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banks'] })
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBank,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banks'] })
  });
};