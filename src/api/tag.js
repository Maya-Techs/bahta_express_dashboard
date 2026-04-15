import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';
import axios from '../utils/axios';

export const endpoints = {
  tags: '/tags',
  create: '/tag',
  update: '/tag/',
  delete: '/tag/'
};

export function useGetTags() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(`${endpoints.tags}`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      tags: data ? data?.data : [],
      tagsLoading: isLoading,
      tagsError: error,
      tagsValidating: isValidating,
      tagsEmpty: !isLoading && !data?.tags?.length,
      refreshTags: () => mutate()
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export async function createTag(newTag) {
  const data = newTag;

  mutate(
    endpoints.tags,
    (currentTag) => {
      if (!currentTag || !currentTag.tags) return { tags: [data] };

      return {
        ...currentTag,
        tags: [...currentTag.tags, data]
      };
    },
    false
  );

  try {
    const res = await axios.post(endpoints.create, data);

    mutate(endpoints.tags);

    return { status: res.data.status };
  } catch (error) {
    return { error: error.error };
  }
}

export async function updateTag(tagId, formData) {
  mutate(
    endpoints.tags,
    (currentTags) => {
      if (!currentTags) return { tags: [] };
      const newTags = currentTags.tags.map((tag) => (tag.tag_id === tagId ? { ...tag, ...formData } : tag));
      return { ...currentTags, tags: newTags };
    },
    false
  );

  try {
    await axios.put(`${endpoints.update}${tagId}`, formData);
    await mutate(endpoints.tags);
    return { success: true };
  } catch (error) {
    console.error('Error updating tag:', error);
  }
}

export async function deleteTag(tagId) {
  mutate(
    endpoints.tags,
    (currentTags) => {
      const updatedTags = currentTags.tags.filter((tag) => tag.tag_id !== tagId);

      return {
        ...currentTags,
        tags: updatedTags
      };
    },
    false
  );

  try {
    const result = await axios.delete(`${endpoints.delete}${tagId}`);
    mutate(endpoints.tags);
    return { error: null, message: result.data.message, ...result.data };
  } catch (error) {
    return { error: error.response.data.error };
  }
}

export function handlerShareInventoryDialog(modal) {
  mutate(
    endpoints.modal,
    (currentTagsMaster) => {
      return { ...currentTagsMaster, modal };
    },
    false
  );
}
