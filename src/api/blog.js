import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher } from '../utils/axios';
import axios from '../utils/axios';

export const endpoints = {
  adminBlogs: '/admin/blogs',
  publicBlogs: '/api/pub/blogs',
  allPublicBlogs: '/api/pub/all-blogs',
  blogInitialData: (id) => `/blog/edit/data/${id}`,
  blogDetails: (id) => `/api/blog/details/${id}`,
  relatedBlogs: '/api/blog/related',
  createBlog: '/blog',
  updateBlog: (id) => `/blog/${id}`,
  deleteBlog: (id) => `/api/blog/${id}`
};

// ----------- Hooks -----------

export function useGetAdminBlogs() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.adminBlogs, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return useMemo(
    () => ({
      blogs: data ? data.data : [],
      loading: isLoading,
      error,
      validating: isValidating,
      refresh: () => mutate(endpoints.adminBlogs)
    }),
    [data, isLoading, error, isValidating]
  );
}

export function useGetPublicBlogs() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.publicBlogs, fetcher);
  return useMemo(
    () => ({
      blogs: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      refresh: () => mutate(endpoints.publicBlogs)
    }),
    [data, isLoading, error, isValidating]
  );
}

export function useGetAllPublicBlogs() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.allPublicBlogs, fetcher);
  return useMemo(
    () => ({
      blogs: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      refresh: () => mutate(endpoints.allPublicBlogs)
    }),
    [data, isLoading, error, isValidating]
  );
}

export function useGetBlogInitialData(id) {
  const { data, isLoading, error } = useSWR(id ? endpoints.blogInitialData(id) : null, fetcher);
  return { data: data ? data.data : [], loading: isLoading, error };
}

export function useGetBlogDetails(id) {
  const { data, isLoading, error } = useSWR(id ? endpoints.blogDetails(id) : null, fetcher);
  return { blog: data ? data.data : [], loading: isLoading, error };
}

// ----------- CRUD Actions -----------

export async function createBlog(blogData) {
  try {
    const res = await axios.post(endpoints.createBlog, blogData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    await mutate(endpoints.adminBlogs);
    return { success: true, data: res.data };
  } catch (error) {
    return { error: error || 'Create failed' };
  }
}

export async function updateBlog(id, data) {
  try {
    const res = await axios.put(endpoints.updateBlog(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    await mutate(endpoints.adminBlogs);
    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { error: error.response?.data?.error || 'Update failed' };
  }
}

export async function deleteBlog(id) {
  try {
    const res = await axios.delete(endpoints.deleteBlog(id));
    await mutate(endpoints.adminBlogs);
    return { success: true, message: res.data.message };
  } catch (error) {
    return { error: error.response?.data?.error || 'Delete failed' };
  }
}

export async function getRelatedBlogs(data) {
  try {
    const res = await axios.post(endpoints.relatedBlogs, data);
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.error || 'Fetch related blogs failed' };
  }
}
