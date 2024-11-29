// app/features/blog/hooks/useBlogPosts.ts
import useSWR from 'swr';
import type { BlogPost } from '../types/blog.types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');
  if (!data.success || !Array.isArray(data.posts)) throw new Error('Invalid response format');
  return data.posts;
};

export function useBlogPosts(perPage = 4) {
  const { data, error, isLoading } = useSWR<BlogPost[]>(
    `/api/sdnblog?per_page=${perPage}`,
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