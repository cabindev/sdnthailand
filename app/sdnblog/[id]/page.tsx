// app/sdnblog/[id]/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import BlogPostDetail from '../components/blog-detail/BlogPostDetail'
import LoadingSpinner from '../components/LoadingSpinner'

export const dynamic = 'force-dynamic'

interface Props {
 params: { id: string } 
}

async function getBlogPost(id: string) {
 const postData = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sdnblog/${id}`, {
   cache: 'no-store',
   headers: { 'Accept': 'application/json' }
 })
 
 const viewData = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sdnblog/views/${id}`, {
   cache: 'no-store' 
 })

 const [postResponse, viewResponse] = await Promise.all([postData, viewData])
 
 if (!postResponse.ok) throw new Error('Failed to fetch blog post')
 
 const post = await postResponse.json()
 const views = await viewResponse.json()

 return {
   ...post.data,
   viewCount: views.count
 }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
 try {
   const post = await getBlogPost(params.id)
   const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default-og.png'
   const description = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || ''

   return {
     title: post.title?.rendered,
     description,
     openGraph: {
       title: post.title?.rendered, 
       description,
       url: `https://sdnthailand.com/sdnblog/${params.id}`,
       siteName: 'SDN Thailand',
       locale: 'th_TH',
       type: 'article',
       publishedTime: post.date,
       authors: [post.uagb_author_info?.display_name].filter(Boolean),
       images: [{
         url: featuredImage,
         width: 1200,
         height: 630,
         alt: post.title?.rendered
       }]
     },
     twitter: {
       card: 'summary_large_image',
       title: post.title?.rendered,
       description,
       images: [featuredImage]
     },
     alternates: {
       canonical: `https://sdnthailand.com/sdnblog/${params.id}`
     }
   }
 } catch (error) {
   return {
     title: 'SDN Thailand',
     description: 'บทความ เรื่องราววิถีชีวิต ผู้คน วัฒนธรรม',
   }
 }
}

export default async function Page({ params }: Props) {
 try {
   const post = await getBlogPost(params.id)
   
   return (
     <Suspense fallback={<LoadingSpinner />}>
       <BlogPostDetail post={post} />
     </Suspense>
   )
 } catch (error) {
   return (
     <div className="container mx-auto px-4 py-20">
       <div className="max-w-lg mx-auto bg-red-50 text-red-500 p-4 rounded-lg">
         <p className="flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           ไม่พบบทความที่ต้องการ
         </p>
       </div>
     </div>
   )
 }
}