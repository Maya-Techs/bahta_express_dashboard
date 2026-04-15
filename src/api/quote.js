import useSWR from 'swr';
import { mutate } from 'swr';
import { useMemo } from 'react';
import axios, { fetcher } from '../utils/axios';

export const endpoints = {
  quotes: '/quotes',
  create: '/quote',
  update: '/quote/',
  update_status: '/quote/',
  delete: '/quote/'
};

export function useGetQuotes() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.quotes, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(() => {
    const quotes = data?.quotes || data?.data || [];

    return {
      quotes,
      quotesLoading: isLoading,
      quotesError: error,
      quotesValidating: isValidating,
      quotesEmpty: !isLoading && quotes.length === 0,
      refreshQuotes: () => mutate(endpoints.quotes)
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

export async function createQuote(newQuote) {
  mutate(
    endpoints.quotes,
    (currentData) => {
      const quotes = currentData?.quotes || currentData?.data || [];
      return {
        ...currentData,
        quotes: [...quotes, newQuote]
      };
    },
    false
  );

  try {
    const res = await axios.post(endpoints.create, newQuote);
    await mutate(endpoints.quotes);
    return { status: res.data.status };
  } catch (error) {
    return { error: error?.response?.data?.error || 'Failed to create quote' };
  }
}

export async function updateQuote(quoteId, formData) {
  mutate(
    endpoints.quotes,
    (currentData) => {
      const quotes = currentData?.quotes || [];
      const updated = quotes.map((quote) => (quote.quote_id === quoteId ? { ...quote, ...formData } : quote));
      return { ...currentData, quotes: updated };
    },
    false
  );

  try {
    await axios.put(`${endpoints.update}${quoteId}`, formData);
    await mutate(endpoints.quotes);
    return { success: true };
  } catch (error) {
    console.error('Error updating quote:', error);
    return { error: error?.response?.data?.error || 'Failed to update quote' };
  }
}
export async function updateQuoteStatus(quoteId, formData) {
  mutate(
    endpoints.quotes,
    (currentData) => {
      const quotes = currentData?.quotes || [];
      const updated = quotes.map((quote) => (quote.quote_id === quoteId ? { ...quote, ...formData } : quote));
      return { ...currentData, quotes: updated };
    },
    false
  );

  try {
    await axios.put(`${endpoints.update}${quoteId}/status`, formData);
    await mutate(endpoints.quotes);
    return { success: true };
  } catch (error) {
    console.error('Error updating quote status:', error);
    return { error: error?.response?.data?.error || 'Failed to update quote status' };
  }
}
export async function deleteQuote(quoteId) {
  mutate(
    endpoints.quotes,
    (currentData) => {
      const quotes = currentData?.quotes || [];
      const updated = quotes.filter((quote) => quote.quote_id !== quoteId);
      return { ...currentData, quotes: updated };
    },
    false
  );

  try {
    const res = await axios.delete(`${endpoints.delete}${quoteId}`);
    await mutate(endpoints.quotes);
    return { ...res.data };
  } catch (error) {
    return { error: error?.response?.data?.error || 'Failed to delete quote' };
  }
}
