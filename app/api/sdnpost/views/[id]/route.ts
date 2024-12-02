// app/api/sdnpost/views/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ViewResponse } from '@/app/sdnpost/types'

const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com'

export async function GET(
 request: NextRequest,
 { params }: { params: { id: string } }
): Promise<NextResponse<ViewResponse>> {
 if (!params.id) {
   return NextResponse.json(
     { success: false, error: 'Post ID is required' },
     { status: 400 }
   )
 }

 try {
   console.log('GET Views - Post ID:', params.id)
   
   const response = await fetch(
     `${baseUrl}/wp-json/wp/v2/post-views/${params.id}`,
     {
       headers: {
         'Accept': 'application/json'
       },
       next: { revalidate: 60 }
     }
   )

   if (!response.ok) {
     console.error('Error response:', await response.text())
     throw new Error(`Failed to fetch views: ${response.statusText}`)
   }

   const data = await response.json()
   
   return NextResponse.json({
     success: data.success,
     count: data.views || 0,
     meta: data.meta
   })

 } catch (error) {
   console.error('Error getting views:', error)
   return NextResponse.json({
     success: false,
     count: 0,
     error: 'Failed to fetch views'
   })
 }
}

export async function POST(
 request: NextRequest,
 { params }: { params: { id: string } }
): Promise<NextResponse<ViewResponse>> {
 if (!params.id) {
   return NextResponse.json(
     { success: false, error: 'Post ID is required' },
     { status: 400 }
   )
 }

 try {
   console.log('POST Views - Post ID:', params.id)
   
   const response = await fetch(
     `${baseUrl}/wp-json/wp/v2/post-views/increase/${params.id}`,
     {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
       cache: 'no-store'
     }
   )

   if (!response.ok) {
     const errorText = await response.text()
     console.error('Views API Error:', errorText)
     throw new Error('Failed to increment views')
   }

   const data = await response.json()

   // ตรวจสอบ response
   if (!data.success) {
     throw new Error(data.error || 'Failed to increment views')
   }

   console.log('Successfully updated views:', data)

   return NextResponse.json({
     success: data.success,
     count: data.views || 0,
     meta: data.meta
   })

 } catch (error) {
   console.error('Error incrementing views:', error)

   // ถ้ามีข้อผิดพลาด ลองดึงยอดวิวปัจจุบัน
   try {
     const currentResponse = await fetch(
       `${baseUrl}/wp-json/wp/v2/post-views/${params.id}`,
       {
         headers: {
           'Accept': 'application/json'
         }
       }
     )

     if (currentResponse.ok) {
       const currentData = await currentResponse.json()
       return NextResponse.json({
         success: true,
         count: currentData.views || 0,
         meta: currentData.meta
       })
     }
   } catch (e) {
     console.error('Error fetching current views:', e)
   }

   return NextResponse.json({
     success: false,
     error: error instanceof Error ? error.message : 'Failed to update views',
     count: 0
   }, { status: 500 })
 }
}

