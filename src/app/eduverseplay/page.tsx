
'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import Hls from 'hls.js';

function EduversePlayPageContent() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  }, [videoUrl]);


  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      {videoUrl ? (
        <video ref={videoRef} controls autoPlay className="w-full h-full max-w-4xl" />
      ) : (
        <div className="flex items-center justify-center h-full">Invalid video URL.</div>
      )}
    </div>
  );
}

export default function EduversePlayPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>}>
      <EduversePlayPageContent />
    </Suspense>
  );
}
