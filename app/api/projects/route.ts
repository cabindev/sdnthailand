// app/api/projects/route.ts
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await axios.get('https://sdnthailand.com/wp-json/wp/v2/project', {
      params: {
        per_page: 100,
        status: 'publish',
        _embed: true
      }
    })

    // ส่งข้อมูลดิบไปให้ client จัดการ
    return NextResponse.json(response.data)

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data)
    }
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}