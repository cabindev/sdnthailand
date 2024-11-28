// BlogCard.tsx
import Link from 'next/link';
import { BlogPost } from '../types/blog.types';

interface BlogCardProps {
  post: BlogPost;
  isLarge?: boolean;
}

export default function BlogCard({ post, isLarge = false }: BlogCardProps) {
  const featuredImage = post.uagb_featured_image_src?.full?.[0] || 
                       post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                       '/images/default-blog.jpg';

  if (isLarge) {
    return (
      <Link href={`/sdnblog/${post.id}`}>
        <div className="flex md:h-[400px] bg-white rounded-xl overflow-hidden">
          {/* รูปด้านซ้าย - ปรับให้กินพื้นที่เต็ม */}
          <div className="relative w-full md:w-2/3">
            <img
              src={featuredImage}
              alt={post.title.rendered}
              className="w-full h-full object-cover"
            />
            {/* Overlay text บนรูป */}
            {/* <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">บูชาแม่กาเผือก</h2>
              <p className="text-sm md:text-base">ความเชื่อด้านนาพระเจ้าท่าพระองค์ ประเพณียี่เป็งของชาวลำนนา</p>
            </div> */}
          </div>
          
          {/* เนื้อหาด้านขวา */}
          <div className="w-full md:w-1/3 p-6 bg-orange-100">
            <h3 
              className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div 
              className="text-gray-600 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: post.uagb_excerpt }}
            />
            <span className="text-orange-500 hover:text-orange-600 transition-colors">
              อ่านเพิ่มเติม...
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Normal card for other posts
  return (
    <Link href={`/sdnblog/${post.id}`} className="block bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={featuredImage}
          alt={post.title.rendered}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 bg-orange-100">
        <h3 
          className="font-bold text-gray-900 mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <span className="text-orange-500 text-sm">อ่านเพิ่มเติม...</span>
      </div>
    </Link>
  );
}