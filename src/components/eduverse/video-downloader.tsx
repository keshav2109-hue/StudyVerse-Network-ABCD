
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';
import { getQualityUrl, getAvailableQualities, type Quality } from './custom-video-player';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VideoDownloaderProps {
  videoUrl: string;
}

export function VideoDownloader({ videoUrl }: VideoDownloaderProps) {
  const [status, setStatus] = useState('Ready');
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<Quality>('720p');
  
  const availableQualities = getAvailableQualities(videoUrl);

  async function downloadVideo() {
    setIsDownloading(true);
    setStatus('Starting download...');
    setProgress(0);

    try {
      const urlToDownload = getQualityUrl(videoUrl, selectedQuality);
      setStatus('Fetching video information...');
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
      a.download = `eduverse_video_${selectedQuality}.mp4`;
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
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="flex flex-col items-center h-auto text-white hover:text-cyan-400 gap-1">
            <Download className="w-6 h-6" />
            <span>Download</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-800 text-white border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Select Download Quality</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Choose the quality for the video you want to download. Higher quality will result in a larger file size.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <RadioGroup defaultValue={selectedQuality} onValueChange={(q: Quality) => setSelectedQuality(q)} className="my-4">
            {availableQualities.map((quality) => (
              <div key={quality} className="flex items-center space-x-2">
                <RadioGroupItem value={quality} id={`q-${quality}`} className="text-cyan-400 border-cyan-400" />
                <Label htmlFor={`q-${quality}`} className="text-white">{quality}</Label>
              </div>
            ))}
          </RadioGroup>
          {isDownloading && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-cyan-500 h-2.5 rounded-full"
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
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={downloadVideo} disabled={isDownloading} className="bg-cyan-500 hover:bg-cyan-600">
              {isDownloading ? <Loader className="animate-spin" /> : 'Download'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
