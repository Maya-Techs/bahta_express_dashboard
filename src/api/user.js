import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';
import axios from '../utils/axios';

export const endpoints = {
  get_users: '/api/users/',
  getByuserId: '/api/user/',
  create: '/api/admin/user',
  update: '/api/admin/user/',
  delete: '/api/admin/user/'
};

export function useGetUsers() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(`${endpoints.get_users}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      users: data ? data?.data : [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users?.length,
      refreshUsers: () => mutate()
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function createUser(newuser) {
  const data = newuser;

  // Optimistically add the new user to the list
  mutate(
    endpoints.get_users,
    (currentuser) => {
      if (!currentuser || !currentuser.users) return { users: [data] }; // Ensure the structure exists

      return {
        ...currentuser,
        users: [...currentuser.users, data] // ✅ Append instead of mapping
      };
    },
    false
  );

  try {
    const res = await axios.post(endpoints.create, data);

    // After successful creation, trigger re-fetch to get the correct user data from the backend
    mutate(endpoints.get_users);

    return { status: res.data.status };
  } catch (error) {
    return { error: error.error };
  }
}

export async function updateUser(userId, formData) {
  mutate(
    endpoints.get_users,
    (currentUsers) => {
      if (!currentUsers) return { users: [] }; // Prevent errors if data is undefined
      const newUsers = currentUsers.users.map((user) => (user.user_id === userId ? { ...user, ...formData } : user));
      return { ...currentUsers, users: newUsers };
    },
    false
  );

  try {
    await axios.put(`${endpoints.update}${userId}`, formData);
    await mutate(endpoints.get_users); // Ensure re-fetching after update
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

export async function deleteuser(userId) {
  mutate(
    endpoints.get_users,
    (currentusers) => {
      const updatedusers = currentusers.users.filter((user) => user.user_id !== userId);

      return {
        ...currentusers,
        users: updatedusers
      };
    },
    false
  );

  try {
    const result = await axios.delete(`${endpoints.delete}${userId}`);
    mutate(endpoints.get_users);
    return { error: null, message: result.data.message, ...result.data };
  } catch (error) {
    return { error: error.response.data.error };
  }
}

export function handlerShareInventoryDialog(modal) {
  // to update local state based on key

  mutate(
    endpoints.modal,
    (currentusersmaster) => {
      return { ...currentusersmaster, modal };
    },
    false
  );
}
