import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'SDN Thailand'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sdnpost/${params.id}`)
  const result = await response.json()
  const post = result.data

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          padding: '48px 48px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              lineHeight: 1.3,
              marginBottom: '16px',
            }}
          >
            {post.title.rendered}
          </h1>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '340px',
            overflow: 'hidden',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={post.title.rendered}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/images/logo.svg`}
                alt="SDN Thailand"
                width={200}
                height={200}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            marginTop: 'auto',
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/images/logo.svg`}
            alt="SDN Thailand"
            width={48}
            height={48}
            style={{ marginRight: '16px' }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1a1a1a',
              }}
            >
              SDN Thailand Support
            </span>
            <span
              style={{
                fontSize: '16px',
                color: '#4b5563',
              }}
            >
              support.sdnthailand.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}