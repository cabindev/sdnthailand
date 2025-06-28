// BlogCard.tsx
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: {
    rendered: string;
  };
  uagb_excerpt: string;
  uagb_featured_image_src?: {
    full?: string[];
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          large?: { source_url: string };
          medium_large?: { source_url: string };
        };
      };
    }>;
  };
}

interface BlogCardProps {
  post: BlogPost;
  isLarge?: boolean;
}

export default function BlogCard({ post, isLarge = false }: BlogCardProps) {
  // เลือกภาพความละเอียดสูงสุดที่มี
  const getHighQualityImage = () => {
    // ลำดับความสำคัญ: full > large > medium_large > source_url > default
    const mediaDetails = post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes;
    
    if (mediaDetails?.full?.source_url) {
      return mediaDetails.full.source_url;
    }
    
    if (mediaDetails?.large?.source_url) {
      return mediaDetails.large.source_url;
    }
    
    if (mediaDetails?.medium_large?.source_url) {
      return mediaDetails.medium_large.source_url;
    }
    
    if (post.uagb_featured_image_src?.full?.[0]) {
      return post.uagb_featured_image_src.full[0];
    }
    
    if (post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
      return post._embedded["wp:featuredmedia"][0].source_url;
    }
    
    return "/images/default-blog.jpg";
  };

  const featuredImage = getHighQualityImage();

  // Mobile Card
  const mobileCard = (
    <div className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-video">
        <Image
          src={featuredImage}
          alt={post.title.rendered.replace(/<[^>]*>/g, '')}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={isLarge}
          quality={85}
        />
      </div>
      <div className="p-4 bg-orange-100">
        <h3
          className="font-bold text-gray-900 mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <span className="text-orange-500 text-sm group-hover:text-orange-600 transition-colors">
          อ่านเพิ่มเติม
        </span>
      </div>
    </div>
  );

  // Desktop Large Card - เพิ่มความละเอียดสูงสุด
  const desktopLargeCard = (
    <div className="hidden md:flex md:h-[450px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative w-2/3 overflow-hidden">
        <Image
          src={featuredImage}
          alt={post.title.rendered.replace(/<[^>]*>/g, '')}
          fill
          sizes="(min-width: 768px) 66vw, (min-width: 1024px) 50vw"
          className="object-cover object-center hover:scale-105 transition-transform duration-700"
          priority={true}
          quality={95}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {/* เพิ่ม overlay gradient เพื่อให้ข้อความอ่านง่ายขึ้น */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent" />
      </div>
      <div className="w-1/3 p-6 bg-orange-100 flex flex-col justify-center">
        <h3
          className="text-2xl font-bold text-gray-900 mb-4 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div
          className="text-gray-600 mb-6 line-clamp-4 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.uagb_excerpt }}
        />
        <span className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors font-medium">
          อ่านเพิ่มเติม
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </div>
  );

  if (isLarge) {
    return (
      <Link href={`/sdnblog/${post.id}`} className="group">
        <div className="md:hidden">{mobileCard}</div>
        {desktopLargeCard}
      </Link>
    );
  }

  return (
    <Link href={`/sdnblog/${post.id}`} className="group">
      {mobileCard}
    </Link>
  );
}