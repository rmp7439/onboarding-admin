import { apiClient } from '../api/axios';
import { type User, type CreateUserPayload } from '../types/user';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users');
  return data.data;
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const { data } = await apiClient.post('/users', payload);
  return data.data;
};

export const updateUser = async (id: string, payload: Partial<CreateUserPayload>): Promise<User> => {
  const { data } = await apiClient.put(`/users/${id}`, payload);
  return data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const assignUnits = async (id: string, unitIds: string[]): Promise<User> => {
  const { data } = await apiClient.put(`/users/${id}/units`, { unitIds });
  return data.data;
};