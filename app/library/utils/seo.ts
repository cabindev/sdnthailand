// app/library/utils/seo.ts

// schemas สำหรับ structured data
export const generateBookCollectionSchema = () => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "นิทานปลูกพลังบวก",
    "description": "รวมนิทานสำหรับเด็กและเยาวชน สร้างภูมิคุ้มกัน ลดปัจจัยเสี่ยง เหล้าบุหรี่",
    "keywords": "นิทานลดปัจจัยเสี่ยง, นิทานเหล้าบุหรี่เด็กเล็ก, นิทานปลูกพลังบวก, นิทานสร้างจิตสำนึก, นิทานสร้างภูมิคุ้มกัน",
    "publisher": {
      "@type": "Organization",
      "name": "SDN Thailand",
      "url": "https://sdnthailand.com"
    }
   });
   
   // สร้าง meta tags สำหรับ SEO
   export const generateMetaTags = () => {
    const title = "นิทานปลูกพลังบวก | SDN Thailand";
    const description = "นิทานสำหรับเด็กและเยาวชน จากเครือข่ายงดเหล้า สร้างภูมิคุ้มกัน ลดปัจจัยเสี่ยง";
    const image = "https://blog.sdnthailand.com/wp-content/uploads/2024/11/ชุดกิจกรรมปลูกพลังบวก.jpg";
   
    return {
      title,
      meta: [
        {
          name: "description",
          content: description
        },
        {
          name: "keywords", 
          content: "นิทานลดปัจจัยเสี่ยง, นิทานเหล้าบุหรี่เด็กเล็ก, นิทานปลูกพลังบวก, นิทานสร้างจิตสำนึก, นิทานสร้างภูมิคุ้มกัน"
        },
        // Open Graph
        {
          property: "og:title",
          content: title
        },
        {
          property: "og:description",
          content: description  
        },
        {
          property: "og:image",
          content: image
        },
        {
          property: "og:url",
          content: "https://sdnthailand.com/library"
        },
        {
          property: "og:type", 
          content: "website"
        },
        // Twitter
        {
          name: "twitter:card",
          content: "summary_large_image"  
        },
        {
          name: "twitter:title",
          content: title
        },
        {
          name: "twitter:description", 
          content: description
        },
        {
          name: "twitter:image",
          content: image
        }
      ]
    };
   };
   
   // Generate canonical URL
   export const getCanonicalUrl = (path: string) => {
    return `https://sdnthailand.com${path}`;
   };
   
   // Generate breadcrumb schema
   export const generateBreadcrumbSchema = () => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "หน้าแรก",
        "item": "https://sdnthailand.com"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "นิทานปลูกพลังบวก",
        "item": "https://sdnthailand.com/library"
      }
    ]
   });
   
   declare global {
    interface Window {
      gtag: (
        command: 'config' | 'event' | 'set',
        targetId: string,
        config?: {
          page_path?: string;
          page_title?: string;
          page_location?: string;
          send_to?: string;
          [key: string]: any;
        }
      ) => void;
    }
  }
  
  // Analytics helper with better type safety
  export const trackPageView = (page: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: page,
        page_title: title
      });
    }
  };
   
   // Helper สำหรับ generate sitemap
   export const generateSitemapUrls = () => {
    return [
      {
        url: 'https://sdnthailand.com/library',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8
      }
    ];
   };
   
   // Function เพื่อตรวจสอบและ optimize รูปภาพ
   export const getOptimizedImageUrl = (imageUrl: string) => {
    // เช็คว่าเป็น URL ที่ถูกต้องหรือไม่
    try {
      const url = new URL(imageUrl);
      return url.toString();
    } catch (e) {
      return '/images/default-book-cover.jpg'; // รูปภาพ default
    }
   };