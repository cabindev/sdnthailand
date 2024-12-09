// app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ปรับให้ใช้ slug แทน id และเพิ่ม _embed
    const res = await fetch(
      `https://blog.sdnthailand.com/wp-json/wp/v2/project?slug=${params.id}&_embed=true`, 
      {
        next: { revalidate: 3600 }
      }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch project')
    }

    const projects = await res.json()
    // ส่งกลับ project แรกเนื่องจาก response เป็น array
    return NextResponse.json(projects[0] || null)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch project from WordPress' },
      { status: 500 }
    )
  }
}