import { apiClient } from '../api/axios';

export const getAdmins = async () => {
  const { data } = await apiClient.get('/admins');
  return data.data;
};

export const createAdmin = async (payload: any) => {
  const { data } = await apiClient.post('/admins', payload);
  return data.data;
};

export const updateAdmin = async (id: string, payload: any) => {
  const { data } = await apiClient.put(`/admins/${id}`, payload);
  return data.data;
};

export const deleteAdmin = async (id: string) => {
  await apiClient.delete(`/admins/${id}`);
};

export const resetAdminPassword = async (id: string, password: string) => {
  await apiClient.patch(`/admins/${id}/password`, { password });
};