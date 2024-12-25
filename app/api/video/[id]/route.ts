// app/api/video/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const WP_API_URL = 'https://blog.sdnthailand.com/wp-json/wp/v2'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('Fetching video with ID:', id);

    // ดึงข้อมูลจาก WordPress API โดยตรง
    const response = await fetch(`${WP_API_URL}/videos/${id}?_embed`, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }
    });

    console.log('WordPress API Response status:', response.status);

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const video = await response.json();

    // Extract YouTube URL
    const youtubeUrl = video.content?.rendered.match(/src="(https:\/\/www\.youtube\.com\/embed\/[^"]+)"/)?.[1];

    // Prepare response data
    const responseData = {
      ...video,
      youtubeUrl,
      featuredImage: video._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || video.uagb_featured_image_src?.full?.[0]
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error in video API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 404 }
    );
  }
}