import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'SDN Thailand'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: { id: string } }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sdnpost/${params.id}`
    )
    const result = await response.json()
    const post = result.data

    if (!post) throw new Error('Post not found')

    const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const title = post.title?.rendered || 'SDN Thailand'

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            position: 'relative',
          }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            {title}
          </div>
        </div>
      )
    )
  } catch (error) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f97316',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          SDN Thailand
        </div>
      )
    )
  }
}