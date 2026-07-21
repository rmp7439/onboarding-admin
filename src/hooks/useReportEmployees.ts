import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { type ReportFilters } from '../services/reportService';

export const useReportEmployees = (filters: ReportFilters) => {
  return useQuery({
    queryKey: ['reportEmployees', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.day) params.append('day', filters.day);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.unit) params.append('unit', filters.unit);
      if (filters.userId) params.append('userId', filters.userId);
      
      const { data } = await apiClient.get(`/reports/employees?${params.toString()}`);
      return data.data;
    }
  });
};