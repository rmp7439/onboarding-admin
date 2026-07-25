import { apiClient } from '../api/axios';

export const getBanks = async (): Promise<{ id: string; name: string; createdAt: string }[]> => {
  const { data } = await apiClient.get('/banks');
  return data.data;
};

export const createBank = async (payload: { name: string }): Promise<any> => {
  const { data } = await apiClient.post('/banks', payload);
  return data.data;
};

export const updateBank = async (id: string, payload: { name: string }): Promise<any> => {
  const { data } = await apiClient.put(`/banks/${id}`, payload);
  return data.data;
};

export const deleteBank = async (id: string): Promise<void> => {
  await apiClient.delete(`/banks/${id}`);
};