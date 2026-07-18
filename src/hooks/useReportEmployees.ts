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
      
      const { data } = await apiClient.get(`/reports/employees?${params.toString()}`);
      return data.data;
    }
  });
};