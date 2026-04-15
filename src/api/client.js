import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';
import axios from '../utils/axios';

export const endpoints = {
  clients: '/clients',
  create: '/client',
  update: '/client/',
  delete: '/client/'
};

export function useGetClients() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(`${endpoints.clients}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      clients: data ? data : [],
      clientsLoading: isLoading,
      clientsError: error,
      clientsValidating: isValidating,
      clientsEmpty: !isLoading && (!data || data.length === 0),
      refreshClients: () => mutate()
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createClient(newClient) {
  mutate(
    endpoints.clients,
    (currentData) => {
      if (!currentData) return [newClient];
      return [...currentData, newClient];
    },
    false
  );

  try {
    const res = await axios.post(endpoints.create, newClient, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    await mutate(endpoints.clients);
    return { status: res.data.status, message: res.data.error };
  } catch (error) {
    return { error: error.response?.data?.error || error.error };
  }
}

export async function updateClient(clientId, formData) {
  mutate(
    endpoints.clients,
    (currentData) => {
      if (!currentData) return [];
      return currentData.map((client) => (client.client_id === clientId ? { ...client, ...formData } : client));
    },
    false
  );

  try {
    await axios.post(`${endpoints.update}${clientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    await mutate(endpoints.clients);
    return { success: true };
  } catch (error) {
    console.error('Error updating client:', error);
    return { error: error.response?.data?.error || 'Update failed' };
  }
}

export async function deleteClient(clientId) {
  mutate(
    endpoints.clients,
    (currentData) => {
      if (!currentData) return [];
      return currentData.filter((client) => client.client_id !== clientId);
    },
    false
  );

  try {
    const res = await axios.delete(`${endpoints.delete}${clientId}`);
    await mutate(endpoints.clients);
    return { message: res.data.message };
  } catch (error) {
    return { error: error.response?.data?.error || 'Delete failed' };
  }
}
