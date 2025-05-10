import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';

export const endpoints = {
  getStats: '/dashboard/stats'
};

// ----------- Hooks -----------

export function useGetStats() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.getStats, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
 
  return useMemo(
    () => ({
      stats: data ? data : [],
      loading: isLoading,
      error,
      validating: isValidating,
      refresh: () => mutate(endpoints.getStats)
    }),
    [data, isLoading, error, isValidating]
  );
}
