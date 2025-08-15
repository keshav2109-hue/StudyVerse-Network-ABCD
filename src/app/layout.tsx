'use client';
import type { Metadata } from 'next';
import './globals.css';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/eduverse/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [appIsOn, setAppIsOn] = useState<boolean>(true); // Optimistically start with true

  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextmenu);

    const checkAppStatus = async () => {
      try {
        const response = await fetch('/api/app-status', { cache: 'no-store' });
        const data = await response.json();
        if (!data.on) {
          // Give a small delay before turning off to avoid flicker on fast networks
          // if the user just happens to load when the app is being turned off.
          setTimeout(() => {
            setAppIsOn(false);
          }, 1000); 
        }
      } catch (error) {
        console.error("Failed to fetch app status, defaulting to off:", error);
        setAppIsOn(false);
      }
    };

    checkAppStatus();

    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);

  if (!appIsOn) {
    // App is off, render a blank screen.
    return (
        <html lang="en">
            <body className="bg-black"></body>
        </html>
    );
  }

  // Render the app while the check happens or if the app is on.
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
