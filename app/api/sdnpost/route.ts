// app/api/sdnpost/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const revalidate = 3600; // revalidate cache every hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get('per_page') || '4';

  try {
    const res = await fetch(
      `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?per_page=${perPage}&_embed=true`,
      {
        headers: {
          'Accept': 'application/json',
          ...headers()
        }
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await res.json();

    return NextResponse.json({
      success: true,
      posts,
      totalPages: res.headers.get('x-wp-totalpages'),
      total: res.headers.get('x-wp-total')
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}