// app/sdnpost/[id]/metadata.ts
import { Metadata } from "next";

// ปรับ interface ให้รองรับ metadata ที่จำเป็น
interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          full?: {
            source_url: string;
            width?: number;
            height?: number;
          };
        };
      };
    }>;
    author?: Array<{
      name: string;
    }>;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    // ใช้ fetch แทน axios เพื่อให้ทำงานได้ใน server component
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sdnpost/${params.id}`,
      {
        next: { revalidate: 3600 }, // cache 1 ชั่วโมง
      }
    );
    const { data: post } = await res.json();

    // ดึงข้อมูลรูปภาพ
    const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0];
    const imageUrl =
      featuredImage?.media_details?.sizes?.full?.source_url ||
      featuredImage?.source_url ||
      "https://sdnthailand.com/images/default-og.png";

    // ทำความสะอาด description จาก HTML tags
    const description =
      post.excerpt?.rendered?.replace(/<[^>]*>/g, "").slice(0, 200) ||
      post.content?.rendered?.replace(/<[^>]*>/g, "").slice(0, 200);
    return {
      title: post.title.rendered,
      description,
      openGraph: {
        type: "article",
        url: `https://sdnthailand.com/sdnpost/${params.id}`,
        title: post.title.rendered,
        description,
        siteName: "SDN Thailand",
        locale: "th_TH",
        publishedTime: post.date,
        authors: [post._embedded?.author?.[0]?.name || "SDN Thailand"],
        images: [
          {
            url: imageUrl,
            width: featuredImage?.media_details?.sizes?.full?.width || 1200,
            height: featuredImage?.media_details?.sizes?.full?.height || 630,
            alt: post.title.rendered,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title.rendered,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "SDN Thailand",
      description: "ศูนย์บริการลูกค้า SDN Thailand",
    };
  }
}
