'use client';
import type { Metadata } from 'next';
import './globals.css';
import { useEffect } from 'react';
import { Footer } from '@/components/eduverse/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextmenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Eduverse 2.0</title>
        <meta
          name="description"
          content="Eduverse 2.0 - Your gateway to knowledge"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Footer />
        </body>
    </html>
  );
}
