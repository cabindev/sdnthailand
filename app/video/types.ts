// app/video/types.ts
export interface VideoPost {
    id: number;
    date: string;
    title: {
      rendered: string;
    };
    content: {
      rendered: string;
      protected: boolean;
    };
    excerpt?: {  // เพิ่ม excerpt
      rendered: string;
    };
    acf?: {      // เพิ่ม acf fields
      video_duration: string;
    };
    uagb_featured_image_src?: {
      full: [string, number, number, boolean];
      thumbnail: [string, number, number, boolean];
    };
    uagb_author_info?: {
      display_name: string;
      author_link: string;
    };
    _embedded?: {
      'wp:term'?: Array<Array<{
        id: number;
        name: string;
        slug: string;
      }>>;
      'wp:featuredmedia'?: Array<{
        source_url: string;
        media_details?: {
          sizes?: {
            full?: {
              source_url: string;
            };
            thumbnail?: {
              source_url: string;
            };
          };
        };
      }>;
    };
    uagb_excerpt?: string;
  }