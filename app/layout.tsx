import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import authOptions from "./lib/configs/auth/authOptions";
import ConditionalNavbar from "./components/ConditionalNavbar";
import 'antd/dist/reset.css';
import { IBM_Plex_Sans_Thai_Looped } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'

// Local Seppuri font
const seppuri = localFont({
  src: [
    {
      path: './fonts/Seppuri-Regular.ttf',
      weight: '400',
    },
    {
      path: './fonts/Seppuri-Medium.ttf',
      weight: '500',
    }
  ],
  variable: '--font-seppuri'
})

// IBM Plex Sans Thai Looped
const ibmPlex = IBM_Plex_Sans_Thai_Looped({
  weight: ['400'],
  subsets: ['thai'],
  variable: '--font-ibm'
})

export const metadata: Metadata = {
  metadataBase: new URL("https://support.sdnthailand.com"),
  title: {
    default: "SDN Thailand",
    template: '%s | SDN Thailand'
  },
  description: "SDN Thailand - เครือข่ายองค์กรงดเหล้า",
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://support.sdnthailand.com',
    siteName: 'SDN Thailand',
    title: 'SDN Thailand',
    description: 'SDN Thailand - เครือข่ายองค์กรงดเหล้า',
    images: [
      {
        url: 'https://support.sdnthailand.com/images/og-image.jpg', // ต้องมีรูป default
        width: 1200,
        height: 630,
        alt: 'SDN Thailand'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SDN Thailand',
    description: 'SDN Thailand - เครือข่ายองค์กรงดเหล้า',
    images: ['https://support.sdnthailand.com/images/og-image.jpg'], // ใช้รูปเดียวกับ og
  }
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="th" className={`${seppuri.variable} ${ibmPlex.variable}`}>
      <body>
        <SessionProvider session={session}>
          <ConditionalNavbar />
          <main className="font-ibm"> {/* default font for body */}
            {children}
            <Toaster position="bottom-center" />
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}