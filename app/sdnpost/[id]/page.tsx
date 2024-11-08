'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import ShareButtons from '../components/ShareButtons'
import RelatedPosts from '../components/RelatedPosts'
import { Toaster } from 'react-hot-toast'
import { FaEye, FaPlay, FaStop ,FaPause } from 'react-icons/fa'

interface Post {
  id: number
  title: { rendered: string }
  date: string
  content: { rendered: string }
  viewCount?: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
    }>
    author?: Array<{
      name: string
      avatar_urls?: {
        [key: string]: string
      }
    }>
    'wp:term'?: Array<Array<{
      id: number
      name: string
      slug: string
    }>>
  }
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewIncremented, setViewIncremented] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (!params?.id) return;
    
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/sdnpost/${params.id}?_embed`)
        if (!res.ok) throw new Error('Failed to fetch post')
        const data = await res.json()
        setPost(data)

        if (!viewIncremented) {
          await fetch(`/api/sdnpost/views/${params.id}`, {
            method: 'POST'
          })
          setViewIncremented(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPost()
  }, [params?.id, viewIncremented])

    // เพิ่ม state สำหรับจัดการการหยุดชั่วคราว
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

    // ปรับปรุงฟังก์ชัน speak
    const speak = useCallback(() => {
      if (!post || !window.speechSynthesis) {
        alert('เบราว์เซอร์ของคุณไม่รองรับ Text-to-Speech หรือไม่พบเนื้อหาบทความ');
        return;
      }

      try {
        // ถ้ากำลังพูดอยู่
        if (isSpeaking) {
          if (isPaused) {
            // ถ้าหยุดชั่วคราวอยู่ ให้เล่นต่อ
            window.speechSynthesis.resume();
            setIsPaused(false);
          } else {
            // ถ้ากำลังเล่นอยู่ ให้หยุดชั่วคราว
            window.speechSynthesis.pause();
            setIsPaused(true);
          }
          return;
        }

        // เริ่มอ่านใหม่
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content.rendered;
        const textContent = tempDiv.textContent?.trim() || '';

        if (!textContent) {
          alert('ไม่พบเนื้อหาที่สามารถอ่านได้');
          return;
        }

        const newUtterance = new SpeechSynthesisUtterance(textContent);
        newUtterance.lang = 'th-TH';
        newUtterance.rate = 1.0;
        newUtterance.pitch = 1.0;

        newUtterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setUtterance(null);
        };

        newUtterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
          setIsPaused(false);
          setUtterance(null);
        };

        setUtterance(newUtterance);
        setIsSpeaking(true);
        setIsPaused(false);
        window.speechSynthesis.cancel(); // ยกเลิกการอ่านก่อนหน้า (ถ้ามี)
        window.speechSynthesis.speak(newUtterance);

      } catch (error) {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
        setIsPaused(false);
        setUtterance(null);
        alert('เกิดข้อผิดพลาดในการอ่านเนื้อหา');
      }
    }, [post, isSpeaking, isPaused]);

    // เพิ่มฟังก์ชันสำหรับหยุดการอ่านทั้งหมด
    const stopSpeaking = useCallback(() => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setIsPaused(false);
      setUtterance(null);
    }, []);

    // ปรับปรุง cleanup
    useEffect(() => {
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setIsPaused(false);
        setUtterance(null);
      };
    }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto bg-red-50 text-red-500 p-4 rounded-lg">
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      </div>
    )
  }

  // No post found
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-gray-500">
          <p>ไม่พบบทความ</p>
        </div>
      </div>
    )
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const author = post._embedded?.author?.[0]
  const categories = post._embedded?.['wp:term']?.[0] || []
  const shareUrl = `https://sdnthailand.com/sdnpost/${post.id}`

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
      <Toaster />
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {categories.map(cat => (
                  <span
                    key={cat.id}
                    className="bg-orange-50 text-orange-600 text-xs md:text-sm px-3 py-1 rounded-full"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title and Text-to-Speech Controls */}
            <div>
              <h1 
                className="text-2xl md:text-4xl font-seppuri font-bold mb-4 leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              
              <div className="flex justify-end gap-2 py-2">
                <button
                  onClick={speak}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                    ${isSpeaking 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                    } transition-colors`}
                >
                  {isSpeaking ? (
                    isPaused ? (
                      <>
                        <FaPlay className="w-3 h-3" />
                        เล่นต่อ
                      </>
                    ) : (
                      <>
                        <FaPause className="w-3 h-3" />
                        หยุดชั่วคราว
                      </>
                    )
                  ) : (
                    <>
                      <FaPlay className="w-3 h-3" />
                      อ่านบทความ
                    </>
                  )}
                </button>

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                      bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <FaStop className="w-3 h-3" />
                    หยุดอ่าน
                  </button>
                )}
              </div>
            </div>

            {/* Author and View Count */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200 gap-4">
              <div className="flex items-center gap-4">
                {author?.avatar_urls?.['96'] && (
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full overflow-hidden">
                    <img 
                      src={author.avatar_urls['96']} 
                      alt={author.name || ''} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div>
                  <div className="font-ibm font-medium text-gray-800 text-sm md:text-base">
                    {author?.name}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <FaEye className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-ibm text-sm md:text-base">
                  {post.viewCount?.toLocaleString() || '0'} ครั้ง
                </span>
              </div>
            </div>

            {/* Content */}
            {featuredImage && (
              <div className="mb-8 md:mb-10 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={featuredImage}
                  alt={post.title.rendered}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}

            <div 
              className="prose prose-base md:prose-lg max-w-none
                prose-headings:font-seppuri prose-headings:text-gray-800
                prose-h1:text-2xl md:prose-h1:text-4xl
                prose-h2:text-xl md:prose-h2:text-3xl
                prose-h3:text-lg md:prose-h3:text-2xl
                prose-p:font-ibm prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-orange-500 hover:prose-a:text-orange-600
                prose-img:rounded-xl prose-img:shadow-lg
                prose-strong:text-gray-800
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:font-ibm prose-li:text-gray-600
                mb-8 md:mb-12"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            <RelatedPosts currentPostId={post.id} />

            <div className="mt-8 md:mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/sdnpost" 
                className="inline-flex items-center gap-2 text-orange-100 hover:text-orange-300 transition-colors text-sm md:text-base"
              >
            <span className="inline-flex items-center gap-2 font-ibm text-sm md:text-base bg-gradient-to-r from-orange-300 to-orange-400 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            ข่าวทั้งหมด
            </span>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden md:block w-16">
            <ShareButtons url={shareUrl} title={post.title.rendered} />
          </div>
        </div>
      </div>
    </div>
  )
}