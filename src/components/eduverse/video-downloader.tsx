
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader } from 'lucide-react';
import { getAvailableQualities, type Quality } from './custom-video-player';
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
  isDownloading: boolean;
  onDownload: (quality: Quality) => void;
}

export function VideoDownloader({ videoUrl, isDownloading, onDownload }: VideoDownloaderProps) {
  const [selectedQuality, setSelectedQuality] = useState<Quality>('720p');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const availableQualities = getAvailableQualities(videoUrl);

  const handleDownloadClick = () => {
    setIsDialogOpen(false);
    onDownload(selectedQuality);
  }

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="flex flex-col items-center h-auto text-white hover:text-cyan-400 gap-1" disabled={isDownloading}>
             {isDownloading ? <Loader className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
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
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDownloadClick} className="bg-cyan-500 hover:bg-cyan-600">
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
