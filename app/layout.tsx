import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

const basePath = process.env.NODE_ENV === 'production' ? '/ImageEditor' : '';

export const metadata: Metadata = {
  title: "Image Editor PWA",
  description: "A modern, responsive image editor progressive web app",
  manifest: `${basePath}/manifest.json`,
  icons: {
    apple: `${basePath}/icons/apple-icon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Image Editor PWA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Image Editor" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${basePath}/icons/apple-icon.png`} />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
          <ServiceWorkerRegistration />
        </div>
      </body>
    </html>
  );
} 