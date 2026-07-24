import { useQuery } from '@tanstack/react-query';
import { getActivityLogs } from '../services/activityLogService';

export const useActivityLogs = (filters: any) => {
  return useQuery({
    queryKey: ['activityLogs', filters],
    queryFn: () => getActivityLogs(filters),
  });
};