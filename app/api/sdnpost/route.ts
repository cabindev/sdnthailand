import { NextResponse } from 'next/server';
import axios from 'axios';

const WP_API_URL = process.env.WORDPRESS_API_URL 
  ? `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2`
  : 'https://blog.sdnthailand.com/wp-json/wp/v2';

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '4';

  try {
    const response = await axios.get(`${WP_API_URL}/posts`, {
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

    // ลดการแปลงข้อมูล ใช้ข้อมูลจาก response โดยตรง
    return NextResponse.json({
      success: true,
      posts: response.data,
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
          error: error.response?.data?.message || 'Failed to fetch posts'
        },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}