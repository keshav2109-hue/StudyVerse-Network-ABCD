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
  const [appIsOn, setAppIsOn] = useState<boolean | null>(null);

  useEffect(() => {
    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextmenu);

    const checkAppStatus = async () => {
      try {
        const response = await fetch('https://eduverseapi.vercel.app/eduverse/api/onoroff', { cache: 'no-store' });
        const data = await response.json();
        setAppIsOn(data.on);
      } catch (error) {
        console.error("Failed to fetch app status:", error);
        setAppIsOn(false); // Default to off on error
      }
    };

    checkAppStatus();

    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);

  if (appIsOn === null) {
    // Optional: show a loading indicator
    return (
        <html lang="en">
            <body>
                <div className="flex items-center justify-center min-h-screen bg-slate-900">
                    {/* You can add a loader here if you want */}
                </div>
            </body>
        </html>
    );
  }

  if (!appIsOn) {
    // App is off, render nothing
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
        {children}
        <Footer />
        </body>
    </html>
  );
}
