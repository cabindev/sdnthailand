import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
interface ViewResponse {
  success: boolean;
  count?: number;
  error?: string;
}

// Interface สำหรับ WordPress API Response
interface WordPressViewResponse {
  success: boolean;
  count?: number;
}

// Interface สำหรับ WordPress Post
interface WordPressPost {
  id: number
  date: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      media_details?: {
        sizes?: {
          full?: { source_url: string }
        }
      }
    }>
    author?: Array<{
      name: string
      avatar_urls: {
        [key: string]: string
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
    }>>
  }
  viewCount?: number
}

interface PostResponse {
  success: boolean
  data?: WordPressPost
  error?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ViewResponse>> {
  if (!params.id) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Post ID is required' 
      },
      { status: 400 }
    );
  }

  try {
    const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com';
    
    console.log('API Base URL:', baseUrl);
    console.log('Incrementing views for post:', params.id);

    const response = await fetch(
      `${baseUrl}/wp-json/post-views/views/post/${params.id}/increment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data: WordPressViewResponse = await response.json();

    // Revalidate the post page after updating view count
    revalidatePath(`/blog/${params.id}`);

    return NextResponse.json({
      success: true,
      count: data.count || 0
    });

  } catch (error) {
    console.error('Error incrementing views:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to increment views: ${errorMessage}`
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<PostResponse>> {
  if (!params.id) {
    return NextResponse.json(
      {
        success: false,
        error: 'Post ID is required'
      },
      { status: 400 }
    );
  }

  try {
    const baseUrl = process.env.WORDPRESS_API_URL || 'https://blog.sdnthailand.com';
    
    console.log('API Base URL:', baseUrl);
    console.log('Fetching post:', params.id);

    const postResponse = await fetch(
      `${baseUrl}/wp-json/wp/v2/posts/${params.id}?_embed`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      throw new Error(`Post API returned ${postResponse.status}: ${errorText}`);
    }

    const post: WordPressPost = await postResponse.json();

    const viewResponse = await fetch(
      `${baseUrl}/wp-json/post-views/views/post/${params.id}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (viewResponse.ok) {
      const viewData = await viewResponse.json();
      post.viewCount = viewData.count || 0;
    }

    // Revalidate both the specific post page and blog listing
    revalidatePath(`/blog/${params.id}`);
    revalidatePath('/blog');

    return NextResponse.json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch post: ${errorMessage}`
      },
      { status: 500 }
    );
  }
}