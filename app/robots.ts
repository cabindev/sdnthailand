// app/robots.ts

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/dashboard/',
        '/admin/',
        '/private/',
        '/studio/',
        '/*?*', // ป้องกัน query parameters
      ],
    },
    sitemap: 'https://sdnthailand.com/sitemap.xml',
  }
}