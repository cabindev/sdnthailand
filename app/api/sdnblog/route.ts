// app/api/sdnblog/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '9';

  try {
    // ใช้ blog_post endpoint
    const response = await axios.get('https://blog.sdnthailand.com/wp-json/wp/v2/blog_post', {
      params: {
        page,
        per_page,
        status: 'publish',
        _embed: true
      }
    });

    // ตรวจสอบและ log response เพื่อดู structure
    // console.log('API Response:', {
    //   status: response.status,
    //   headers: response.headers,
    //   data: response.data
    // });

    const posts = response.data;

    return NextResponse.json({
      success: true,
      posts,
      totalPages: Number(response.headers['x-wp-totalpages']),
      total: Number(response.headers['x-wp-total'])
    });

  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      console.log('Error Response:', error.response?.data);
      return NextResponse.json(
        { 
          success: false, 
          error: error.response?.data?.message || 'Failed to fetch blog posts',
          details: error.response?.data
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}