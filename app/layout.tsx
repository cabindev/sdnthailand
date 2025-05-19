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
import SWRProvider from "./providers/SWRProvider";
import Footer from "./components/Footer";

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
  metadataBase: new URL('https://sdnthailand.com'),
  title: {
    default: 'SDN Thailand',
    template: '%s | SDN Thailand'
  },
  description: 'สำนักงานเครือข่ายองค์กรงดเหล้า (สคล)',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: 'https://sdnthailand.com',
    siteName: 'SDN Thailand',
    images: [{
      url: '/images/default-og.png',
      width: 1200,
      height: 630,
      alt: 'SDN Thailand'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sdnthailand'
  }
}

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
          <SWRProvider>
            <ConditionalNavbar />
            <main className="font-ibm min-h-screen">
              {children}
              <Toaster position="bottom-center" />
            </main>
            <Footer/>
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}