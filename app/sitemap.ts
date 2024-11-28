// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ดึงโพสต์ทั้งหมดจาก API
  const res = await fetch(`${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?per_page=100`)
  const posts = await res.json()

  // สร้าง sitemap entries สำหรับโพสต์
  const postEntries = posts.map((post: any) => ({
    url: `https://sdnthailand.com/sdnpost/${post.id}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // เพิ่มหน้าหลักและหน้าสำคัญอื่นๆ
  return [
    {
      url: 'https://sdnthailand.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://sdnthailand.com/sdnpost',
      lastModified: new Date(),
      changeFrequency: 'daily', 
      priority: 0.8,
    },
    ...postEntries,
  ]
}