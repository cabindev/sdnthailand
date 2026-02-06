import useSWR from 'swr';
import type { MapPortalDocument } from '../types';

const fetcher = async (url: string): Promise<MapPortalDocument[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

const API_URL = '/api/mapportal/documents';

export function useMapPortalDocuments() {
  const { data, error, isLoading, mutate } = useSWR<MapPortalDocument[]>(
    API_URL,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      revalidateIfStale: true,
      revalidateOnReconnect: false,
    }
  );

  return {
    documents: data || [],
    error,
    isLoading,
    mutate,
  };
}
