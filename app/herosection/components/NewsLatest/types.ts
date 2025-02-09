// app/components/NewsLatest/types.ts
export interface Post {
    id: number;
    title: { rendered: string };
    date: string;
    excerpt: { rendered: string };
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string;
        media_details?: {
          sizes?: {
            thumbnail?: { source_url: string };
            medium?: { source_url: string };
            large?: { source_url: string };
          }
        }
      }>;
    };
  }
  
  export interface NewsData {
    posts: Post[];
    totalPages: number;
    total: number;
  }