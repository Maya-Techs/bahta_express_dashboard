import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';
import axios from '../utils/axios';

export const endpoints = {
  categories: '/categories',
  create: '/category',
  update: '/category/',
  delete: '/category/'
};

export function useGetCategories() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(`${endpoints.categories}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      categories: data ? data?.data : [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.categories?.length,
      refreshCategories: () => mutate()
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function createCategory(newCategory) {
  const data = newCategory;

  mutate(
    endpoints.categories,
    (currentCategory) => {
      if (!currentCategory || !currentCategory.categories) return { categories: [data] };

      return {
        ...currentCategory,
        categories: [...currentCategory.categories, data]
      };
    },
    false
  );

  try {
    const res = await axios.post(endpoints.create, data);

    mutate(endpoints.categories);

    return { status: res.data.status };
  } catch (error) {
    return { error: error.error };
  }
}

export async function updateCategory(categoryId, formData) {
  mutate(
    endpoints.categories,
    (currentCategories) => {
      if (!currentCategories) return { categories: [] };
      const newCategories = currentCategories.categories.map((category) =>
        category.category_id === categoryId ? { ...category, ...formData } : category
      );
      return { ...currentCategories, categories: newCategories };
    },
    false
  );

  try {
    await axios.put(`${endpoints.update}${categoryId}`, formData);
    await mutate(endpoints.categories);
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
  }
}

export async function deleteCategory(categoryId) {
  mutate(
    endpoints.categories,
    (currentCategories) => {
      const updatedCategories = currentCategories.categories.filter((category) => category.category_id !== categoryId);

      return {
        ...currentCategories,
        categories: updatedCategories
      };
    },
    false
  );

  try {
    const result = await axios.delete(`${endpoints.delete}${categoryId}`);
    mutate(endpoints.categories);
    return { error: null, message: result.data.message, ...result.data };
  } catch (error) {
    return { error: error.response.data.error };
  }
}

export function handlerShareInventoryDialog(modal) {
  mutate(
    endpoints.modal,
    (currentCategoriesMaster) => {
      return { ...currentCategoriesMaster, modal };
    },
    false
  );
}
