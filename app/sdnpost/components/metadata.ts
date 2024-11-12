// app/sdnpost/components/metadata.ts
import { Metadata } from 'next'

// Types
export interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  viewCount?: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    author?: Array<{
      name: string;
      avatar_urls?: {
        [key: string]: string;
      }
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

interface Params {
  params: {
    id: string;
  };
}

// Constants
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://support.sdnthailand.com/'
const SITE_NAME = 'SDN Thailand'
const DEFAULT_DESCRIPTION = 'เครือข่ายองค์กรงดเหล้า'

// Utility Functions
const stripHtmlTags = (html: string): string => {
  if (typeof window !== 'undefined') {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }
  return html.replace(/<[^>]*>/g, '')
}

const createCanonicalUrl = (postId: string): string => {
  return `${BASE_URL}/sdnpost/${postId}`
}

// API Functions
async function fetchPostData(postId: string): Promise<Response> {
  const response = await fetch(`${BASE_URL}/api/sdnpost/${postId}?_embed`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.statusText}`)
  }

  return response
}

// Metadata Generation
export async function generatePostMetadata({ params }: Params): Promise<Metadata> {
  try {
    const response = await fetchPostData(params.id)
    const post: Post = await response.json()

    if (!post) {
      return createDefaultMetadata('ไม่พบบทความ', 'ไม่พบบทความที่คุณกำลังค้นหา')
    }

    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const cleanTitle = stripHtmlTags(post.title.rendered)
    const cleanDescription = stripHtmlTags(post.excerpt?.rendered || '')
    const canonicalUrl = createCanonicalUrl(params.id)

    return {
      title: `${cleanTitle} - ${SITE_NAME}`,
      description: cleanDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: cleanTitle,
        description: cleanDescription,
        type: 'article',
        url: canonicalUrl,
        siteName: SITE_NAME,
        locale: 'th_TH',
        images: featuredImage ? [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: cleanTitle,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: cleanTitle,
        description: cleanDescription,
        images: featuredImage ? [featuredImage] : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error)
    return createDefaultMetadata()
  }
}

// Helper function for default metadata
function createDefaultMetadata(
  title: string = SITE_NAME,
  description: string = DEFAULT_DESCRIPTION
): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  }
}

// Post Data Fetching
export async function fetchPost(id: string): Promise<Post | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/sdnpost/${id}?_embed`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const post = await response.json()
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

// View Count Management
export async function incrementViewCount(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/sdnpost/views/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return false
  }
}