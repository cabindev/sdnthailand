export interface NewsPost {
    id: number;
    title: {
      rendered: string;
    };
    excerpt: {
      rendered: string;
    };
    date: string;
    _embedded?: {
      'wp:featuredmedia'?: Array<{
        source_url: string;
        media_details?: {
          sizes?: {
            medium?: {
              source_url: string;
            }
          }
        }
      }>;
      'wp:term'?: Array<Array<{
        id: number;
        name: string;
      }>>;
      author?: Array<{
        name: string;
        avatar_urls?: {
          [key: string]: string;
        };
      }>;
    };
    'post-views-counter'?: number;
  }