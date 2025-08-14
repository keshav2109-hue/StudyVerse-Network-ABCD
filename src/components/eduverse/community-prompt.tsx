
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Send, Youtube } from "lucide-react";

interface CommunityPromptProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommunityPrompt({ isOpen, onOpenChange }: CommunityPromptProps) {
  const handleTelegramClick = () => {
    window.open("https://t.me/EduVerse_Network", "_blank");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 text-white border-blue-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-bold text-cyan-300">
            Join Our Community!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-slate-300 pt-2">
            Stay updated with the latest announcements, get your doubts cleared, and connect with fellow learners.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 py-4">
            <Button 
                onClick={handleTelegramClick}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-6 text-lg font-semibold rounded-lg flex items-center justify-center gap-3 transition-transform hover:scale-105"
            >
                <Send className="w-6 h-6" />
                Join on Telegram
            </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 border-0">
            Maybe Later
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
