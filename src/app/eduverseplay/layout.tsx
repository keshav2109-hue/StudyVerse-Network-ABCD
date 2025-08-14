'use client';

import '../globals.css';
import { useEffect } from 'react';

export default function VideoPlayerLayout({
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
        <title>Eduverse 2.0 - Player</title>
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
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
