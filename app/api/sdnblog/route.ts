// app/api/sdnblog/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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
      }
    });

    const posts = response.data;
    
    // Revalidate the blog path
    revalidatePath('/blog');

    return NextResponse.json({
      success: true,
      posts,
      totalPages: Number(response.headers['x-wp-totalpages']),
      total: Number(response.headers['x-wp-total'])
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