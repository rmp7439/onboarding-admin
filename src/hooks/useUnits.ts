import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUnits, createUnit, updateUnit, deleteUnit } from '../services/unitService';

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] })
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name: string; requiredFields: string[] } }) => updateUnit(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] })
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] })
  });
};