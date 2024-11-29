// BlogCard.tsx
import Link from "next/link";
import { BlogPost } from "../types/blog.types";

interface BlogCardProps {
  post: BlogPost;
  isLarge?: boolean;
}

export default function BlogCard({ post, isLarge = false }: BlogCardProps) {
  const featuredImage =
    post.uagb_featured_image_src?.full?.[0] ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/default-blog.jpg";

  // ในหน้าจอเล็กจะแสดงแบบเดียวกันหมด
  const mobileCard = (
    <div className="block bg-white rounded-xl overflow-hidden">
      <div className="relative aspect-video">
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
    </div>
  );

  // การ์ดใหญ่สำหรับหน้าจอ desktop
  const desktopLargeCard = (
    <div className="hidden md:flex md:h-[450px] bg-white rounded-xl overflow-hidden">
      <div className="relative w-2/3">
        <img
          src={featuredImage}
          alt={post.title.rendered}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-1/3 p-6 bg-orange-100">
        <h3
          className="text-2xl font-bold text-gray-900 mb-4"
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
  );

  if (isLarge) {
    return (
      <Link href={`/sdnblog/${post.id}`}>
        <>
          {/* แสดงการ์ดแบบ mobile ในหน้าจอเล็ก */}
          <div className="md:hidden">{mobileCard}</div>
          {/* แสดงการ์ดใหญ่ในหน้าจอ desktop */}
          {desktopLargeCard}
        </>
      </Link>
    );
  }

  // Normal card
  return (
    <Link
      href={`/sdnblog/${post.id}`}
      className="block hover:shadow-md transition-shadow"
    >
      {mobileCard}
    </Link>
  );
}
