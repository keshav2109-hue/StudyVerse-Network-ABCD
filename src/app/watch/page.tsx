
'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VideoPlayer() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');
  const videoType = searchParams.get('videoType');
  const title = searchParams.get('title');

  if (!videoUrl) {
    return <div className="flex items-center justify-center h-full">Invalid video URL.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
        {videoType === 'youtube' ? (
          <iframe
            src={videoUrl}
            title={title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
          ></iframe>
        ) : (
          <iframe
            src={videoUrl}
            title={title || "Video player"}
            className="w-full aspect-video"
            allowFullScreen
          ></iframe>
        )}
    </div>
  );
}


export default function WatchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
          <VideoPlayer />
      </div>
    </Suspense>
  );
}
