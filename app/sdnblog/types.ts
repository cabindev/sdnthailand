// app/sdnblog/types.ts

export interface Post {
  id: number
  title: { rendered: string }
  date: string
  content: { rendered: string }
  excerpt: { rendered: string }
  slug: string
  link: string
  modified: string
  featured_media: number
  
  // Meta fields
  meta?: {
    [key: string]: any
    'post-views-counter'?: number
  }
 
  // Embedded content
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      media_details?: {
        sizes?: {
          thumbnail?: { source_url: string }
          medium?: { source_url: string }
          large?: { source_url: string }
          full?: { source_url: string }
        }
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
    author?: Array<{
      name: string
      avatar_urls?: {
        [key: string]: string
      }
    }>
  }
 
  // Additional fields
  uagb_featured_image_src?: {
    full: [string, number, number, boolean]
    thumbnail: [string, number, number, boolean]
    medium: [string, number, number, boolean]
    medium_large: [string, number, number, boolean]
    large: [string, number, number, boolean]
  }
  
  uagb_author_info?: {
    display_name: string
    author_link: string
  }
  
  uagb_excerpt?: string
  viewCount?: number
  'post-views-counter'?: number
  featuredImage?: string
 }
 
 export interface BlogResponse {
  posts: Post[]
  totalPages: number
  total: number
 }
 
 export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  count: number
 }
 
 export interface Author {
  id: number 
  name: string
  url?: string
  description?: string
  avatar_urls?: {
    [key: string]: string
  }
 }
 
 export interface ViewResponse {
  success: boolean
  count?: number
  error?: string  
 }
 
 // API Response Types
 export interface ApiSuccessResponse<T> {
  success: true
  data: T
 }
 
 export interface ApiErrorResponse {
  success: false
  error: string
 }
 
 export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
 
 // Additional response types
 export interface PostsResponse extends ApiSuccessResponse<{
  posts: Post[]
  totalPages: number
  total: number
 }> {}
 
 export interface PostResponse extends ApiSuccessResponse<Post> {}
 
 export interface CategoriesResponse extends ApiSuccessResponse<Category[]> {}
 
 export interface AuthorResponse extends ApiSuccessResponse<Author> {}
 
 // Error Types
 export interface BlogError {
  error: string
  status?: number
 }
 
 // Request Types
 export interface PostQueryParams {
  page?: number
  per_page?: number
  search?: string
  categories?: number[]
  tags?: number[]
  author?: number
  orderby?: 'date' | 'title' | 'modified' | 'comment_count'
  order?: 'asc' | 'desc'
 }
 
 // ViewCount Types
 export interface ViewCountData {
  id: number
  count: number
  lastUpdated: string
 }
 
 export interface ViewCountResponse extends ApiSuccessResponse<ViewCountData> {}