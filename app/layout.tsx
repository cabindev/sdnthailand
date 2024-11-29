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

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'https://sdnthailand.com'),
  title: {
    default: 'SDN Thailand ',
    template: '%s | SDN Thailand ',
  },
  description: 'SDN Thailand',
  openGraph: {
    title: 'SDN Thailand ',
    description: 'ข้อมูลข่าวสาร เครือข่ายงดเหล้า SDN Thailand',
    url: 'https://sdnthailand.com',
    siteName: 'SDN Thailand ',
    locale: 'th_TH',
    type: 'website',
  },
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
            <main className="font-ibm">
              {children}
              <Toaster position="bottom-center" />
            </main>
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}