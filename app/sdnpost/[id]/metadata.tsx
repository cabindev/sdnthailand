import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string }}): Promise<Metadata> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sdnpost/${params.id}`)
  const result = await response.json()
  const post = result.data

  if (!post) {
    return {
      title: 'SDN Thailand Support',
      description: 'ศูนย์บริการลูกค้า SDN Thailand'
    }
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

  return {
    title: post.title.rendered,
    description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      images: featuredImage ? [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: post.title.rendered
        }
      ] : [],
      type: 'article',
      locale: 'th_TH'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      images: featuredImage ? [featuredImage] : []
    }
  }
}