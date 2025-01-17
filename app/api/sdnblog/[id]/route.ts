// app/api/sdnblog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const WP_API_URL = 'https://blog.sdnthailand.com/wp-json/wp/v2';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { success: false, error: 'Blog ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${WP_API_URL}/blog_post/${params.id}?_embed=wp:featuredmedia,wp:term,author`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    const post = await response.json();
    
    // Revalidate both the specific post page and the blog listing
    revalidatePath(`/blog/${params.id}`);
    revalidatePath('/blog');

    return NextResponse.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}