import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';
import axios from '../utils/axios';

export const endpoints = {
  services: '/pub/services',
  create: '/service',
  update: '/service/',
  delete: '/service/'
};

export function useGetServices() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(`${endpoints.services}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      services: data ? data?.data : [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.services?.length,
      refreshServices: () => mutate()
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function createService(newService) {
  const data = newService;

  mutate(
    endpoints.services,
    (currentService) => {
      if (!currentService || !currentService.services) return { services: [data] };

      return {
        ...currentService,
        services: [...currentService.services, data]
      };
    },
    false
  );

  try {
    const res = await axios.post(endpoints.create, data);

    mutate(endpoints.services);

    return { status: res.data.status };
  } catch (error) {
    return { error: error.error };
  }
}

export async function updateService(serviceId, formData) {
  mutate(
    endpoints.services,
    (currentServices) => {
      if (!currentServices) return { services: [] };
      const newServices = currentServices.services.map((service) =>
        service.service_id === serviceId ? { ...service, ...formData } : service
      );
      return { ...currentServices, services: newServices };
    },
    false
  );

  try {
    await axios.put(`${endpoints.update}${serviceId}`, formData);
    await mutate(endpoints.services);
    return { success: true };
  } catch (error) {
    console.error('Error updating service:', error);
  }
}

export async function deleteService(serviceId) {
  mutate(
    endpoints.services,
    (currentServices) => {
      const updatedServices = currentServices.services.filter((service) => service.service_id !== serviceId);

      return {
        ...currentServices,
        services: updatedServices
      };
    },
    false
  );

  try {
    const result = await axios.delete(`${endpoints.delete}${serviceId}`);
    mutate(endpoints.services);
    return { error: null, message: result.data.message, ...result.data };
  } catch (error) {
    return { error: error.response.data.error };
  }
}

export function handlerShareInventoryDialog(modal) {
  mutate(
    endpoints.modal,
    (currentServicesMaster) => {
      return { ...currentServicesMaster, modal };
    },
    false
  );
}
