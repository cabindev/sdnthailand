// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/wp-admin/',
          '/wp-login.php',
          '/wp-includes/',
          '*/feed/',
          '*/trackback/',
          '/cgi-bin/',
          '/?'
        ]
      }
    ],
    sitemap: 'https://support.sdnthailand.com/sitemap.xml',
    host: 'https://support.sdnthailand.com/'
  }
}