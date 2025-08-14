'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CustomVideoPlayer } from '@/components/eduverse/custom-video-player';

function EduversePlayPageContent() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      {videoUrl ? (
        <CustomVideoPlayer src={videoUrl} />
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
