import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';
import axios from '../utils/axios';

export const endpoints = {
  adminPortfolios: '/admin/portfolios',
  publicPortfolios: '/api/pub/portfolios',
  allPublicPortfolios: '/api/pub/all-portfolios',
  portfolioInitialData: (id) => `/portfolio/edit/data/${id}`,
  portfolioDetails: (id) => `/api/portfolio/details/${id}`,
  relatedPortfolios: '/api/portfolio/related',
  createPortfolio: '/portfolio',
  updatePortfolio: (id) => `/portfolio/${id}`,
  deletePortfolio: (id) => `/api/portfolio/${id}`
};

// ----------- Hooks -----------

export function useGetAdminPortfolios() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.adminPortfolios, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return useMemo(
    () => ({
      portfolios: data ? data.data : [],
      loading: isLoading,
      error,
      validating: isValidating,
      refresh: () => mutate(endpoints.adminPortfolios)
    }),
    [data, isLoading, error, isValidating]
  );
}

export function useGetPublicPortfolios() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.publicPortfolios, fetcher);
  return useMemo(
    () => ({
      portfolios: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      refresh: () => mutate(endpoints.publicPortfolios)
    }),
    [data, isLoading, error, isValidating]
  );
}

export function useGetAllPublicPortfolios() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.allPublicPortfolios, fetcher);
  return useMemo(
    () => ({
      portfolios: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      refresh: () => mutate(endpoints.allPublicPortfolios)
    }),
    [data, isLoading, error, isValidating]
  );
}

export function useGetPortfolioInitialData(id) {
  const { data, isLoading, error } = useSWR(id ? endpoints.portfolioInitialData(id) : null, fetcher);
  return { data: data ? data.data : [], loading: isLoading, error };
}

export function useGetPortfolioDetails(id) {
  const { data, isLoading, error } = useSWR(id ? endpoints.portfolioDetails(id) : null, fetcher);
  return { portfolio: data ? data.data : [], loading: isLoading, error };
}

// ----------- CRUD Actions -----------

export async function createPortfolio(portfolioData) {
  try {
    const res = await axios.post(endpoints.createPortfolio, portfolioData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    await mutate(endpoints.adminPortfolios);
    return { success: true, data: res.data };
  } catch (error) {
    return { error: error || 'Create failed' };
  }
}

export async function updatePortfolio(id, data) {
  try {
    const res = await axios.put(endpoints.updatePortfolio(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    await mutate(endpoints.adminPortfolios);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { error: error.response?.data?.error || 'Update failed' };
  }
}

export async function deletePortfolio(id) {
  try {
    const res = await axios.delete(endpoints.deletePortfolio(id));
    await mutate(endpoints.adminPortfolios);
    return { success: true, message: res.data.message };
  } catch (error) {
    return { error: error.response?.data?.error || 'Delete failed' };
  }
}

export async function getRelatedPortfolios(data) {
  try {
    const res = await axios.post(endpoints.relatedPortfolios, data);
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Fetch related portfolios failed' };
  }
}
