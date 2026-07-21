import { apiClient } from '../api/axios';
import { type Unit } from '../types/unit';

export const getUnits = async (): Promise<Unit[]> => {
  const { data } = await apiClient.get('/units');
  return data.data;
};