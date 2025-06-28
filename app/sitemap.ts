// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Debug: ตรวจสอบ environment variables
  console.log('WORDPRESS_API_URL:', process.env.WORDPRESS_API_URL);
  console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('WORDPRESS')));
  
  const wordpressUrl = process.env.WORDPRESS_API_URL;
  
  if (!wordpressUrl) {
    console.error('WORDPRESS_API_URL is undefined');
    return [
      {
        url: 'https://sdnthailand.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      }
    ]
  }

  // ตรวจสอบ URL ที่สร้างขึ้น
  const apiUrl = `${wordpressUrl}/wp-json/wp/v2/posts?per_page=100`;
  console.log('API URL:', apiUrl);

  try {
    const res = await fetch(apiUrl)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const posts = await res.json()
    console.log('Posts fetched:', posts.length);

    const postEntries = posts.map((post: any) => ({
      url: `https://sdnthailand.com/sdnpost/${post.id}`,
      lastModified: new Date(post.modified),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

    return [
      {
        url: 'https://sdnthailand.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: 'https://sdnthailand.com/sdnpost',
        lastModified: new Date(),
        changeFrequency: 'daily' as const, 
        priority: 0.8,
      },
      ...postEntries,
    ]
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [
      {
        url: 'https://sdnthailand.com',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      }
    ]
  }
}