
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { CustomVideoPlayer } from '@/components/eduverse/custom-video-player';
import { VideoDownloader } from '@/components/eduverse/video-downloader';
import { VideoNotes } from '@/components/eduverse/video-notes';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

function EduversePlayPageContent() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('videoUrl');
  const [showNotes, setShowNotes] = useState(false);

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-full text-white">Invalid video URL.</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <CustomVideoPlayer src={videoUrl} />
      </div>

      <div className="w-full max-w-4xl p-4 flex justify-center items-center gap-8 bg-gray-900/50">
        <Button variant="ghost" className="flex flex-col items-center h-auto text-white hover:text-cyan-400 gap-1" onClick={() => setShowNotes(!showNotes)}>
            <FileText className="w-6 h-6" />
            <span>Notes</span>
        </Button>
        <VideoDownloader videoUrl={videoUrl} />
      </div>

      {showNotes && (
        <div className="w-full max-w-4xl p-4">
          <VideoNotes videoId={videoUrl} />
        </div>
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
