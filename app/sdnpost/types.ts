// app/sdnpost/types.ts
export interface Post {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  date: string
  excerpt?: {
    rendered: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      media_details?: {
        sizes?: {
          thumbnail?: {
            source_url?: string
          }
          medium?: {
            source_url?: string
          }
          large?: {
            source_url?: string
          }
          full?: {
            source_url?: string
          }
        }
      }
      quote?: string
    }>
    author?: Array<{
      name: string
      avatar_urls?: {
        [key: string]: string
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
  meta?: {
    [key: string]: any
  }
  viewCount?: number
  'post-views-counter'?: number
}

export interface PostResponse {
  success: boolean
  data?: Post
  error?: string
}

export interface ViewResponse {
  success: boolean
  count?: number
  error?: string
}

export interface PostsResponse {
  success: boolean
  data?: {
    posts: Post[]
    totalPages: number
    total: number
  }
  error?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent?: number
  count?: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  description?: string
  count?: number
}