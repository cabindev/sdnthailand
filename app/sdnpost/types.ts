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
        file?: string
        width?: number
        height?: number
      }
      quote?: string  // เพิ่มตามที่เห็นในภาพแรก
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
  viewCount?: number
}

export interface PostState {
  post: Post | null
  viewCount: number
  isLoading: boolean
  error: string | null
}