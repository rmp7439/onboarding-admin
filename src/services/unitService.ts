import { apiClient } from '../api/axios';
import { type Unit } from '../types/unit';

export const getUnits = async (): Promise<Unit[]> => {
  const { data } = await apiClient.get('/units');
  return data.data;
};

export const createUnit = async (payload: { name: string; requiredFields: string[] }): Promise<Unit> => {
  const { data } = await apiClient.post('/units', payload);
  return data.data;
};

export const updateUnit = async (id: string, payload: { name: string; requiredFields: string[] }): Promise<Unit> => {
  const { data } = await apiClient.put(`/units/${id}`, payload);
  return data.data;
};

export const deleteUnit = async (id: string): Promise<void> => {
  await apiClient.delete(`/units/${id}`);
};