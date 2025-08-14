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

    // Apply class to body when this layout is active
    document.body.classList.add('bg-black');
    
    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
      // Clean up class from body when this layout is no longer active
      document.body.classList.remove('bg-black');
    };
  }, []);

  return (
    <>
        <head>
            <title>Eduverse 2.0 - Player</title>
        </head>
        <div className="font-body antialiased bg-black">
            {children}
        </div>
    </>
  );
}
