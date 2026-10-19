import './globals.css';

export const metadata = {
  title: 'PostThreader — Schedule Threads Like You Mean It',
  description: 'Plan, draft, and auto-post your Threads on autopilot. Built for creators, founders, and marketers.',
  keywords: ['Meta Threads', 'Scheduler', 'Social Media Automation', 'PostThreader', 'Next.js'],
  authors: [{ name: 'PostThreader Team' }],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'PostThreader — Schedule Threads Like You Mean It',
    description: 'Plan, draft, and auto-post your Threads on autopilot.',
    url: 'https://postthreader.vercel.app',
    siteName: 'PostThreader',
    images: [
      {
        url: 'https://postthreader.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PostThreader Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PostThreader — Schedule Threads Like You Mean It',
    description: 'Plan, draft, and auto-post your Threads on autopilot.',
    images: ['https://postthreader.vercel.app/og-image.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
