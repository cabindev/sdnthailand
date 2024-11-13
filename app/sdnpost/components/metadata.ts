//app/sdnpost/[id]/metadata.ts
import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://support.sdnthailand.com'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await fetch(`${BASE_URL}/api/sdnpost/${params.id}`)
    const post = await response.json()

    if (!post.success) {
      throw new Error('Failed to fetch post')
    }

    const featuredImage = post.data._embedded?.['wp:featuredmedia']?.[0]?.source_url
    
    return {
      title: post.data.title.rendered,
      description: post.data.excerpt.rendered.replace(/<[^>]*>/g, ''),
      openGraph: {
        title: post.data.title.rendered,
        description: post.data.excerpt.rendered.replace(/<[^>]*>/g, ''),
        type: 'article',
        url: `${BASE_URL}/sdnpost/${params.id}`,
        images: featuredImage ? [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: post.data.title.rendered
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.data.title.rendered,
        description: post.data.excerpt.rendered.replace(/<[^>]*>/g, ''),
        images: featuredImage ? [featuredImage] : [],
      }
    }
  } catch (error) {
    return {
      title: 'SDN Post',
      description: 'SDN Thailand Support Post'
    }
  }
}