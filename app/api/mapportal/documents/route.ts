import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MAPPORTAL_API_URL =
  process.env.MAPPORTAL_API_URL || 'https://sdnmapportal.sdnthailand.com';

export async function GET() {
  try {
    const res = await fetch(`${MAPPORTAL_API_URL}/api/public/documents`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch documents: ${res.status}`);
    }

    const documents = await res.json();

    // Prefix coverImage with absolute URL
    const transformed = documents.map(
      (doc: { coverImage?: string | null }) => ({
        ...doc,
        coverImage: doc.coverImage
          ? `${MAPPORTAL_API_URL}${doc.coverImage}`
          : null,
      })
    );

    return NextResponse.json(transformed);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch documents',
      },
      { status: 500 }
    );
  }
}
