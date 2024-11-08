// app/sitemap.ts
import { MetadataRoute } from "next";

interface Post {
  id: number;
  date: string; // WordPress post date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ฟังก์ชันดึงข้อมูลโพสต์จาก WordPress API
  async function getPosts(): Promise<Post[]> {
    try {
      const res = await fetch(
        'https://sdnthailand.com/wp-json/wp/v2/posts?_fields=id,date&per_page=100',
        { next: { revalidate: 3600 } } // Cache 1 hour
      );
      
      if (!res.ok) throw new Error('Failed to fetch posts');
      
      const posts = await res.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts for sitemap:', error);
      return [];
    }
  }

  const posts = await getPosts();

  const postUrls = posts.map((post) => ({
    url: `https://sdnthailand.com/sdnpost/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  return [
    {
      url: 'https://sdnthailand.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: 'https://sdnthailand.com/sdnpost',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    {
      url: 'https://sdnthailand.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: 'https://sdnthailand.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    ...postUrls
  ];
}