import { Metadata } from 'next'
import axios from 'axios'

interface Post {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  _embedded?: {
    'wp:featuredmedia'?: [{
      source_url: string
    }]
  }
}

interface Params {
  params: {
    id: string
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://support.sdnthailand.com'

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const res = await axios.get(`${BASE_URL}/api/sdnpost/${params.id}`)
    const post = res.data

    const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `${BASE_URL}/images/default-og.png`

    return {
      metadataBase: new URL(BASE_URL),
      title: post.title.rendered,
      description: post.content.rendered.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
      openGraph: {
        title: post.title.rendered,
        description: post.content.rendered.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
        type: 'article',
        url: `${BASE_URL}/sdnpost/${params.id}`,
        siteName: 'SDN Thailand Support',
        locale: 'th_TH',
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title.rendered
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.rendered,
        description: post.content.rendered.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
        images: [imageUrl]
      }
    }
  } catch (error) {
    return {
      title: 'SDN Thailand Support',
      description: 'ศูนย์บริการลูกค้า SDN Thailand'
    }
  }
}