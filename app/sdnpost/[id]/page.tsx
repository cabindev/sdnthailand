// app/sdnpost/[id]/page.tsx
import { Metadata } from 'next'
import PostDetail from './PostDetail'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await fetch(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts/${params.id}?_embed`,
      { next: { revalidate: 60 } }
    ).then(res => res.json())

    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default-og.png'
    const description = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || ''

    const ogImage = {
      url: featuredImage,
      width: 1200,
      height: 630,
      alt: post.title?.rendered
    }

    return {
      title: post.title?.rendered,
      description: description,
      openGraph: {
        title: post.title?.rendered,
        description: description,
        url: `https://sdnthailand.com/sdnpost/${params.id}`,
        siteName: 'SDN Thailand',
        locale: 'th_TH',
        type: 'article',
        publishedTime: post.date,
        authors: [post._embedded?.author?.[0]?.name].filter(Boolean),
        images: [ogImage],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title?.rendered,
        description: description,
        images: [ogImage]
      },
      alternates: {
        canonical: `https://sdnthailand.com/sdnpost/${params.id}`
      }
    }
  } catch (error) {
    return {
      title: 'SDN Thailand',
      description: 'ข่าว และกิจกรรมเครือข่ายภาคประชาสังคม',
    }
  }
}

export default function Page({ params }: Props) {
  return <PostDetail params={params} />
}