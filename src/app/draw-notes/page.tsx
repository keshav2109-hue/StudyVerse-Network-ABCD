
'use client';
import { Suspense } from "react";
import { DrawingCanvas } from "@/components/eduverse/drawing-canvas";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";

function DrawNotesContent() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get('videoId');
    
    if (!videoId) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <p>Error: Video ID is missing. Please return to the video player and try again.</p>
            </div>
        );
    }
    
    return <DrawingCanvas videoId={videoId} />;
}


export default function DrawNotesPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <Loader className="w-8 h-8 animate-spin" />
            <p className="ml-4">Loading Drawing Pad...</p>
        </div>
    }>
      <DrawNotesContent />
    </Suspense>
  );
}
