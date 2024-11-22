import { Metadata } from 'next'
import axios from 'axios'

interface Post {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      media_details?: {
        sizes?: {
          full?: { source_url: string }
        }
      }
    }>
    'wp:term'?: Array<{
      id: number
      name: string
    }[]>
    author?: Array<{
      name: string
      avatar_urls: {
        [key: string]: string
      }
    }>
  }
  viewCount?: number
}

export async function generateMetadata({ params }: { params: { id: string }}): Promise<Metadata> {
  try {
    const res = await axios.get(`/api/sdnpost/${params.id}`)
    const post = res.data.data as Post

    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const description = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').slice(0, 200) || 
                       post.content?.rendered?.replace(/<[^>]*>/g, '').slice(0, 200)

    return {
      title: post.title.rendered,
      description,
      openGraph: {
        title: post.title.rendered,
        description,
        type: 'article',
        url: `https://support.sdnthailand.com/sdnpost/${params.id}`,
        siteName: 'SDN Thailand Support',
        locale: 'th_TH',
        images: [{
          url: featuredImage || 'https://support.sdnthailand.com/images/default-og.png',
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        }],
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error)
    return {
      title: 'SDN Thailand Support',
      description: 'ศูนย์บริการลูกค้า SDN Thailand'
    }
  }
}