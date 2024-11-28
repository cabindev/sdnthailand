// features/blog/types/blog.types.ts
export interface BlogPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media: number;
  blog_category: number[];
  uagb_featured_image_src: {
    full: Array<string>;
    medium: Array<string>;
  };
  uagb_author_info: {
    display_name: string;
    author_link: string;
  };
  uagb_excerpt: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ 
      source_url: string;
      alt_text?: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
    }>>;
  };
}