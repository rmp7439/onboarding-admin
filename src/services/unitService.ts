import { apiClient } from '../api/axios';
import { type Unit } from '../types/unit';

export const getUnits = async (): Promise<Unit[]> => {
  const { data } = await apiClient.get('/units');
  return data.data;
};

export const createUnit = async (name: string): Promise<Unit> => {
  const { data } = await apiClient.post('/units', { name });
  return data.data;
};

export const updateUnit = async (id: string, name: string): Promise<Unit> => {
  const { data } = await apiClient.put(`/units/${id}`, { name });
  return data.data;
};

export const deleteUnit = async (id: string): Promise<void> => {
  await apiClient.delete(`/units/${id}`);
};