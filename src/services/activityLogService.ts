import { apiClient } from '../api/axios';

export const getActivityLogs = async (params: any) => {
  const { data } = await apiClient.get('/activity-logs', { params });
  return data.data;
};