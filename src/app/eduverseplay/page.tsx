
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { CustomVideoPlayer } from '@/components/eduverse/custom-video-player';
import { VideoDownloader } from '@/components/eduverse/video-downloader';
import { VideoNotes } from '@/components/eduverse/video-notes';
import { Button } from '@/components/ui/button';
import { FileText, Download, Type, Brush } from 'lucide-react';
import type { Quality } from '@/components/eduverse/custom-video-player';
import { getQualityUrl } from '@/components/eduverse/custom-video-player';
import Link from 'next/link';

function EduversePlayPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoUrl = searchParams.get('videoUrl');

  const [noteMode, setNoteMode] = useState<'hidden' | 'select' | 'typing'>('hidden');
  const [downloadStatus, setDownloadStatus] = useState('Ready');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (selectedQuality: Quality) => {
    if (!videoUrl) return;

    setIsDownloading(true);
    setDownloadStatus('Starting download...');
    setDownloadProgress(0);

    try {
      const urlToDownload = getQualityUrl(videoUrl, selectedQuality);
      setDownloadStatus('Fetching video information...');
      const playlistResponse = await fetch(urlToDownload);
      if (!playlistResponse.ok) throw new Error(`Failed to fetch playlist: ${playlistResponse.statusText}`);
      const playlistText = await playlistResponse.text();
      
      const baseUrl = urlToDownload.substring(0, urlToDownload.lastIndexOf('/') + 1);

      const segmentUrls = playlistText
        .split('\n')
        .filter((line) => line.trim() && !line.startsWith('#'))
        .map((segment) => (segment.startsWith('http') ? segment : baseUrl + segment));

      if (segmentUrls.length === 0) {
        throw new Error('No video segments found in playlist.');
      }

      setDownloadStatus(`Downloading ${segmentUrls.length} segments...`);
      const segmentBlobs: ArrayBuffer[] = [];
      let downloadedCount = 0;

      for (let i = 0; i < segmentUrls.length; i++) {
        try {
            const segmentResponse = await fetch(segmentUrls[i]);
            if (!segmentResponse.ok) {
                console.warn(`Skipping failed segment: ${segmentUrls[i]}`);
                continue;
            }
            const data = await segmentResponse.arrayBuffer();
            segmentBlobs.push(data);
            
            downloadedCount++;
            const currentProgress = Math.floor((downloadedCount / segmentUrls.length) * 100);
            setDownloadProgress(currentProgress);
            setDownloadStatus(`Downloaded ${downloadedCount}/${segmentUrls.length} segments`);

        } catch (segmentError) {
            console.warn(`Error fetching segment ${segmentUrls[i]}:`, segmentError);
        }
      }

      if (segmentBlobs.length === 0) {
        throw new Error('Failed to download any video segments.');
      }

      setDownloadStatus('Creating video file...');
      const videoBlob = new Blob(segmentBlobs, { type: 'video/mp4' });
      const downloadUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `eduverse_video_${selectedQuality}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setDownloadStatus('Download complete!');
    } catch (error) {
      console.error(error);
      let message = 'An unknown error occurred';
      if (error instanceof Error) {
        message = error.message;
      }
      setDownloadStatus(`Error: ${message}`);
    } finally {
      setIsDownloading(false);
       setTimeout(() => {
        setDownloadStatus('Ready');
       }, 5000);
    }
  };

  const toggleNoteSelector = () => {
    setNoteMode(prev => {
        if (prev === 'hidden') return 'select';
        if (prev === 'typing') return 'select';
        return 'hidden';
    });
  };

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
        <Button variant="ghost" className="flex flex-col items-center h-auto text-white hover:text-cyan-400 gap-1" onClick={toggleNoteSelector}>
            <FileText className="w-6 h-6" />
            <span>Notes</span>
        </Button>
        <VideoDownloader videoUrl={videoUrl} onDownload={handleDownload} isDownloading={isDownloading} />
      </div>

      {isDownloading && (
        <div className="w-full max-w-4xl p-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
                className="bg-cyan-500 h-2.5 rounded-full"
                style={{ width: `${downloadProgress}%`, transition: 'width 0.2s' }}
            ></div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">{downloadStatus}</p>
        </div>
      )}
      
      {noteMode === 'select' && (
         <div className="w-full max-w-4xl p-4 flex justify-center items-center gap-4 bg-gray-900/50 border-t border-gray-800">
            <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white" onClick={() => setNoteMode('typing')}>
                <Type className="mr-2 h-4 w-4" />
                Type Notes
            </Button>
            <Link href={`/draw-notes?videoId=${encodeURIComponent(videoUrl)}`} passHref>
                <Button asChild variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white">
                    <span>
                        <Brush className="mr-2 h-4 w-4" />
                        Draw Notes
                    </span>
                </Button>
            </Link>
         </div>
      )}

      {noteMode === 'typing' && (
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
