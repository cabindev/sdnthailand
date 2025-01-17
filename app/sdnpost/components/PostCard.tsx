import Link from 'next/link'


interface PostCardProps {
  post: {
    id: number;
    title: { rendered: string };
    date: string;
    excerpt: { rendered: string };
    _embedded?: {
      author?: Array<{ name: string }>;
      'wp:term'?: Array<Array<{ name: string }>>;
      'wp:featuredmedia'?: Array<{
        source_url: string;
        media_details?: {
          sizes?: {
            medium?: { source_url: string };
            large?: { source_url: string };
          }
        }
      }>;
    };
  }
}

export default function PostCard({ post }: PostCardProps) {
  // ดึง featured image จาก _embedded
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url || 
  post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  
  const categories = post._embedded?.['wp:term']?.[0] || [];

  return (
    <Link href={`/sdnpost/${post.id}`}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="aspect-video relative overflow-hidden">
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={post.title.rendered}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-orange-50 flex items-center justify-center">
              <svg className="w-12 h-12 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-6">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((cat: any) => (
                <span key={cat.id} 
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full 
                               bg-orange-50 text-orange-600">
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          <h2 
            className="text-xl font-seppuri font-medium mb-3 line-clamp-2 group-hover:text-orange-500"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div 
            className="text-sm text-gray-600 line-clamp-3 mb-4 font-ibm"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          <div className="flex items-center text-sm text-gray-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post._embedded?.author?.[0]?.name && (
              <>
                <span className="mx-2">•</span>
                <span>{post._embedded.author[0].name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}