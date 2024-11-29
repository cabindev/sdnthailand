// app/features/news/hooks/useNewsPosts.ts
import useSWR from 'swr';
import type { NewsPost } from '../types/news.types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error('Failed to fetch posts');
  return data.posts;
};

export function useNewsPosts(perPage = 12) {
  const { data, error, isLoading } = useSWR<NewsPost[]>(
    `/api/sdnpost?per_page=${perPage}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  return {
    posts: data || [],
    isLoading,
    error: error?.message
  };
}