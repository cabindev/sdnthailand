// app/sdnpost/components/SafeImage.tsx
'use client'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  defaultSrc?: string
  loading?: 'lazy' | 'eager'
}

export default function SafeImage({ 
  src, 
  alt, 
  className, 
  defaultSrc = '/images/default-avatar.png',
  loading
}: SafeImageProps) {
  return (
    <img 
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.onerror = null
        target.src = defaultSrc
      }}
    />
  )
}