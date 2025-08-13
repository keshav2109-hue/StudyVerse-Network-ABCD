
'use client'

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CustomHlsPlayer } from '@/components/eduverse/custom-hls-player';

function EduversePlayPageContent() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      {videoUrl ? (
        <CustomHlsPlayer src={videoUrl} />
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
