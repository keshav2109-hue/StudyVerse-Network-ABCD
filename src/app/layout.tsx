'use client';
import type { Metadata } from 'next';
import './globals.css';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/eduverse/footer';
import { Header } from '@/components/eduverse/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [appIsOn, setAppIsOn] = useState(true); // Optimistically start with true

  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextmenu);

    const checkAppStatus = async () => {
      try {
        const response = await fetch('/api/app-status', { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            if (data.on === false) { // Explicitly check for false
                setAppIsOn(false);
            }
        } else {
             // If API fails, default to on to avoid blocking users
            setAppIsOn(true);
        }
      } catch (error) {
        console.error("Failed to fetch app status, defaulting to on:", error);
        setAppIsOn(true);
      }
    };

    checkAppStatus();

    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);

  if (!appIsOn) {
    return (
        <html lang="en">
            <body className="bg-black"></body>
        </html>
    );
  }

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
        <Header />
        {children}
        <Footer />
        </body>
    </html>
  );
}
