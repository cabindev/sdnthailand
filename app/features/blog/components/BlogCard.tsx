// BlogCard.tsx
import Link from "next/link";

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
    }>;
  };
}

interface BlogCardProps {
  post: BlogPost;
  isLarge?: boolean;
}

export default function BlogCard({ post, isLarge = false }: BlogCardProps) {
  const featuredImage =
    post.uagb_featured_image_src?.full?.[0] ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/images/default-blog.jpg";

  // Mobile Card
  const mobileCard = (
    <div className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
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
        <span className="text-orange-500 text-sm group-hover:text-orange-600 transition-colors">
          อ่านเพิ่มเติม
        </span>
      </div>
    </div>
  );

  // Desktop Large Card
  const desktopLargeCard = (
    <div className="hidden md:flex md:h-[450px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
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
          อ่านเพิ่มเติม
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