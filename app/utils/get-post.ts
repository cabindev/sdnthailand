// utils/get-post.ts
import { cache } from 'react'
import 'server-only'

const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'

export const preload = (id: string) => {
  void getPost(id)
}

export const getPost = cache(async (id: string) => {
  const postResponse = await fetch(
    `${baseUrl}/wp-json/wp/v2/posts/${id}?_embed`,
    {
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store' // ไม่ cache เพื่อให้ได้ข้อมูลล่าสุดเสมอ
    }
  )

  if (!postResponse.ok) {
    throw new Error(`Post API returned ${postResponse.status}`)
  }

  const post = await postResponse.json()

  // Fetch view count in parallel
  const viewResponse = await fetch(
    `${baseUrl}/wp-json/post-views/views/post/${id}`,
    {
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store'
    }
  )

  if (viewResponse.ok) {
    const viewData = await viewResponse.json()
    post.viewCount = viewData.count || 0
  }

  return post
})