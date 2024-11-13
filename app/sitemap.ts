import { MetadataRoute } from "next"
import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://support.sdnthailand.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await axios.get(`${BASE_URL}/api/sdnpost`)
    const posts = response.data.posts

    const postUrls = posts.map((post: any) => ({
      url: `${BASE_URL}/sdnpost/${post.id}`,
      lastModified: new Date(post.modified || post.date).toISOString(),
    }))

    return [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${BASE_URL}/sdnpost`,
        lastModified: new Date().toISOString(),
      },
      ...postUrls,
    ]
  } catch (error) {
    return [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
      }
    ]
  }
}