import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shoozy Games · Free Browser Games',
  description:
    'Play free browser games instantly. No downloads, no sign-ups. Just click and play.',
  applicationName: 'Shoozy Games',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0720',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-6890578781595999"
        />

        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6890578781595999"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
