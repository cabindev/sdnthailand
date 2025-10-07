'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight, Clock, User } from "lucide-react";
import Loading from "./loading/Loading";

interface CivicSpacePost {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  author: string;
  category?: string;
  post_type?: string;
  tags?: string[];
  featured_image_url?: string;
  image?: string;
  featured_image?: string;
  thumbnail?: string;
  media?: {
    url: string;
    alt?: string;
  }[];
  created_at: string;
  updated_at?: string;
  view_count?: number;
  reading_time?: number;
  status?: string;
}

interface ApiResponse {
  results?: CivicSpacePost[];
  data?: CivicSpacePost[];
}

export default function CivicSpaceSection() {
  const [posts, setPosts] = useState<CivicSpacePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Try to get popular posts first, then fall back to regular posts
        let response = await fetch('/api/civicspace?type=popular&limit=10');
        if (!response.ok) {
          // Fallback to regular posts if popular fails
          response = await fetch('/api/civicspace?page_size=10');
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        let postsArray: CivicSpacePost[] = [];
        if (Array.isArray(data)) {
          postsArray = data;
        } else if (data.results) {
          postsArray = data.results;
        } else if (data.data) {
          postsArray = data.data;
        }
        
        // Sort by created_at descending (newest first) if not already sorted by API
        const sortedPosts = postsArray.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setPosts(sortedPosts.slice(0, 6)); // Show only 6 posts for cleaner look
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Loading size="lg" className="bg-gray-50 py-20" />;
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">ไม่สามารถโหลดข้อมูลได้: {error}</p>
        </div>
      </section>
    );
  }

  // Create a simple placeholder data URL
  const placeholderImage = "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='18' fill='%23666'%3ECivicSpace%3C/text%3E%3C/svg%3E";

  const getImageUrl = (post: CivicSpacePost) => {
    // Try different image sources in order of preference - use the correct field name
    let imageUrl = post.featured_image_url || 
                   post.featured_image || 
                   post.thumbnail || 
                   post.image ||
                   (post.media && post.media.length > 0 ? post.media[0].url : null);
    
    if (!imageUrl) {
      return placeholderImage;
    }
    
    // If it's already a full URL, use it directly
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative path, prepend the CivicSpace domain
    if (imageUrl.startsWith('/')) {
      return `https://civicspace.sdnthailand.com${imageUrl}`;
    }
    
    // Default case - assume it needs the full domain
    return `https://civicspace.sdnthailand.com/${imageUrl}`;
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="/civicspace.png"
              alt="CivicSpace"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{color: 'oklch(79.5% 0.184 86.047)'}}>
            พื้นที่พลเมือง
          </h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            ร่วมหาทางออกปัญหาแอลกอฮอล์
          </h3>

          {/* Main CTA Button */}
          <div className="mb-12">
            <Link
              href="https://civicspace.sdnthailand.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 text-white text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 group"
              style={{backgroundColor: 'oklch(79.5% 0.184 86.047)'}}
            >
              <ExternalLink className="w-5 h-5 mr-3" />
              พื้นที่พลเมือง
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`https://civicspace.sdnthailand.com/post/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-white rounded-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                index === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${
                index === 0 ? 'h-64 lg:h-80' : 'h-48'
              }`}>
                <Image
                  src={getImageUrl(post)}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholderImage;
                  }}
                  unoptimized={getImageUrl(post).includes('civicspace.sdnthailand.com')}
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 transition-colors ${
                  index === 0 ? 'text-xl' : 'text-lg'
                }`}>
                  {post.title}
                </h3>
                
                {(index === 0 || posts.length <= 3) && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateText(post.content || post.excerpt, 120)}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {post.author && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="truncate">{post.author}</span>
                      </div>
                    )}
                    {post.created_at && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(post.created_at).toLocaleDateString('th-TH', { 
                            day: 'numeric', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 border border-gray-100">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            ร่วมเป็นส่วนหนึ่งของการเปลี่ยนแปลง
          </h4>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            แบ่งปันความคิดเห็น หาทางออกร่วมกัน และสร้างสังคมไทยที่ปลอดภัยจากปัญหาแอลกอฮอล์
          </p>
          
          <div className="flex justify-center">
            <Link
              href="https://www.facebook.com/profile.php?id=61579556311842"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200"
              style={{backgroundColor: 'oklch(79.5% 0.184 86.047)'}}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              CivicSpace
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}