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

    document.body.classList.add('bg-black');
    
    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
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
