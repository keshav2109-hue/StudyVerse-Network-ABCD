'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CustomVideoPlayer } from '@/components/eduverse/custom-video-player';
import { VideoDownloader } from '@/components/eduverse/video-downloader';

function EduversePlayPageContent() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
      {videoUrl ? (
        <div className="w-full max-w-4xl">
          <CustomVideoPlayer src={videoUrl} />
          <div className="mt-4">
            <VideoDownloader videoUrl={videoUrl} />
          </div>
        </div>
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
