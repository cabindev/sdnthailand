import { Metadata } from 'next'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://support.sdnthailand.com'

export async function generateMetadata({ params }: { params: { id: string }}): Promise<Metadata> {
  try {
    const res = await axios.get(`${BASE_URL}/api/sdnpost/${params.id}`)
    const post = res.data

    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const description = post.content.rendered.replace(/<[^>]*>/g, '').slice(0, 200)

    return {
      title: post.title.rendered,
      description,
      openGraph: {
        title: post.title.rendered,
        description,
        type: 'article',
        url: `${BASE_URL}/sdnpost/${params.id}`,
        siteName: 'SDN Thailand Support',
        locale: 'th_TH',
        images: [{
          url: featuredImage || `${BASE_URL}/images/default-og.png`,
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        }],
      }
    }
  } catch (error) {
    return {
      title: 'SDN Thailand Support',
      description: 'ศูนย์บริการลูกค้า SDN Thailand'
    }
  }
}