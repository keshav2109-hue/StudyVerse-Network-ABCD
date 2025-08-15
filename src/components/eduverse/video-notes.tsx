
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoNotesProps {
  videoId: string;
}

export function VideoNotes({ videoId }: VideoNotesProps) {
  const [notes, setNotes] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const getStorageKey = useCallback(() => `eduverse-notes-${videoId}`, [videoId]);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(getStorageKey());
      if (savedNotes) {
        setNotes(savedNotes);
      }
    } catch (error) {
      console.error("Could not load notes from local storage:", error);
    }
  }, [getStorageKey]);

  const handleSave = () => {
    try {
      localStorage.setItem(getStorageKey(), notes);
      toast({
        title: "Notes Saved!",
        description: "Your notes have been saved in this browser.",
        variant: 'default',
        duration: 3000,
      });
    } catch (error) {
      console.error("Could not save notes to local storage:", error);
      toast({
        title: "Error Saving Notes",
        description: "Could not save notes. Your browser storage might be full.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
            title: "Copied to Clipboard!",
            description: "Your notes have been copied.",
        });
    }).catch(err => {
        console.error('Failed to copy notes: ', err);
        toast({
            title: "Copy Failed",
            description: "Could not copy notes to clipboard.",
            variant: "destructive",
        });
    });
  };

  return (
    <div className="w-full bg-gray-900/80 p-4 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-white">My Notes</h3>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Start typing your notes here... they will be saved automatically for this video."
        className="bg-slate-800 text-white border-slate-700 min-h-[150px] focus:ring-cyan-500"
      />
      <div className="flex justify-end gap-2">
        <Button onClick={handleCopy} variant="outline" size="sm" className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white">
          {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {isCopied ? 'Copied!' : 'Copy'}
        </Button>
        <Button onClick={handleSave} size="sm" className="bg-cyan-500 hover:bg-cyan-600">
          <Save className="mr-2 h-4 w-4" />
          Save Notes
        </Button>
      </div>
    </div>
  );
}
