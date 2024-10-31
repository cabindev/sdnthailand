// app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const res = await fetch(`https://sdnthailand.com/wp-json/wp/v2/project/${params.id}`, {
        next: { revalidate: 3600 }
      })
  
      if (!res.ok) {
        throw new Error('Failed to fetch project')
      }
  
      const project = await res.json()
      return NextResponse.json(project)
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch project from WordPress' },
        { status: 500 }
      )
    }
  }