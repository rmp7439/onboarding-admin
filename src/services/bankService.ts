import { apiClient } from '../api/axios';
import { type Bank } from '../types/bank';

export const getBanks = async (): Promise<Bank[]> => {
  const { data } = await apiClient.get('/banks');
  return data.data;
};

export const createBank = async (name: string): Promise<Bank> => {
  const { data } = await apiClient.post('/banks', { name });
  return data.data;
};

export const updateBank = async (id: string, payload: { name: string; isActive: boolean }): Promise<Bank> => {
  const { data } = await apiClient.put(`/banks/${id}`, payload);
  return data.data;
};

export const deleteBank = async (id: string): Promise<void> => {
  await apiClient.delete(`/banks/${id}`);
};