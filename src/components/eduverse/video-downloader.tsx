'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';

interface VideoDownloaderProps {
  videoUrl: string;
}

export function VideoDownloader({ videoUrl }: VideoDownloaderProps) {
  const [status, setStatus] = useState('Ready');
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadVideo() {
    setIsDownloading(true);
    setStatus('Starting download...');
    setProgress(0);

    try {
      setStatus('Fetching video information...');
      const playlistResponse = await fetch(videoUrl);
      if (!playlistResponse.ok) throw new Error(`Failed to fetch playlist: ${playlistResponse.statusText}`);
      const playlistText = await playlistResponse.text();
      const baseUrl = videoUrl.substring(0, videoUrl.lastIndexOf('/') + 1);

      const segmentUrls = playlistText
        .split('\n')
        .filter((line) => line.trim() && !line.startsWith('#'))
        .map((segment) => (segment.startsWith('http') ? segment : baseUrl + segment));

      if (segmentUrls.length === 0) {
        throw new Error('No video segments found in playlist.');
      }

      setStatus(`Downloading ${segmentUrls.length} segments...`);
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
            setProgress(currentProgress);
            setStatus(`Downloaded ${downloadedCount}/${segmentUrls.length} segments`);

        } catch (segmentError) {
            console.warn(`Error fetching segment ${segmentUrls[i]}:`, segmentError);
        }
      }

      if (segmentBlobs.length === 0) {
        throw new Error('Failed to download any video segments.');
      }

      setStatus('Creating video file...');
      const videoBlob = new Blob(segmentBlobs, { type: 'video/mp4' });
      const downloadUrl = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `eduverse_video.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setStatus('Download complete!');
    } catch (error) {
      console.error(error);
      let message = 'An unknown error occurred';
      if (error instanceof Error) {
        message = error.message;
      }
      setStatus(`Error: ${message}`);
    } finally {
      setIsDownloading(false);
      setProgress(0);
       setTimeout(() => {
          if (!isDownloading) setStatus('Ready');
       }, 5000);
    }
  }

  return (
    <div className="w-full text-white bg-gray-900 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Download Video</h3>
      <Button onClick={downloadVideo} disabled={isDownloading} className="w-full bg-blue-600 hover:bg-blue-700">
        {isDownloading ? (
          <>
            <Loader className="animate-spin mr-2" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="mr-2" />
            Download Video
          </>
        )}
      </Button>
      {isDownloading && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${progress}%`, transition: 'width 0.2s' }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">{status}</p>
        </div>
      )}
      {!isDownloading && status !== 'Ready' && (
         <p className={`text-center text-sm mt-2 ${status.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {status}
        </p>
      )}
    </div>
  );
}
