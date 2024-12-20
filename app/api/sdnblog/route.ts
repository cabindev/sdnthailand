// app/api/sdnblog/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

export const revalidate = 60; // revalidate every 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '4';

  try {
    const response = await axios.get('https://blog.sdnthailand.com/wp-json/wp/v2/blog_post', {
      params: {
        page,
        per_page,
        status: 'publish',
        _embed: true
      },
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });

    const posts = response.data;

    return NextResponse.json({
      success: true,
      posts,
      totalPages: Number(response.headers['x-wp-totalpages']),
      total: Number(response.headers['x-wp-total'])
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
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