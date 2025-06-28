// app/sdnpost/[id]/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import { Post } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import PostDetail from '../components/post-detail/PostDetail'

export const dynamic = 'force-dynamic'

async function getPost(id: string) {
 const postData = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sdnpost/${id}`, {
   cache: 'no-store',
   headers: { 'Accept': 'application/json' }
 })
 
 const [postResponse] = await Promise.all([postData])
 
 if (!postResponse.ok) {
   throw new Error('Failed to fetch post') 
 }
 
 const post = await postResponse.json()
 return post.data
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
 try {
   const post = await getPost(params.id)
   const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/default-featured.png'
   const description = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || ''
   const authorName = post._embedded?.author?.[0]?.name
   const authors = authorName ? [authorName] : []
   const title = post.title?.rendered.replace(/<[^>]+>/g, '') || ''

   return {
     title,
     description,
     openGraph: {
       title,
       description,
       url: `https://sdnthailand.com/sdnpost/${params.id}`,
       siteName: 'SDN Thailand',
       locale: 'th_TH',
       type: 'article',
       publishedTime: post.date,
       authors,
       images: [{
         url: featuredImage,
         width: 1200,
         height: 630,
         alt: title
       }],
     },
     twitter: {
       card: 'summary_large_image',
       title, 
       description,
       images: [featuredImage]
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

export default async function Page({ params }: { params: { id: string } }) {
 try {
   const post = await getPost(params.id)
   
   return (
     <Suspense fallback={<LoadingSpinner />}>
       <PostDetail post={post} />
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
           ไม่พบข่าวที่ต้องการ
         </p>
       </div>
     </div>
   )
 }
}