'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Maximize, Minimize, FastForward, Rewind, Settings, Check } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
}

const playbackSpeeds = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];

export function CustomVideoPlayer({ src }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsMenu, setActiveSettingsMenu] = useState<'main' | 'speed'>('main');
  const [playbackRate, setPlaybackRate] = useState(1);
  let controlTimeout: NodeJS.Timeout;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hls = new Hls();

    if (Hls.isSupported()) {
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error("Autoplay was prevented:", e));
        setIsPlaying(true);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.error("Autoplay was prevented:", e));
        setIsPlaying(true);
      });
    }

    const handleTimeUpdate = () => {
        setProgress(video.currentTime);
        if (progressRef.current) {
            const value = (video.currentTime / video.duration) * 100;
            progressRef.current.style.setProperty('--value', `${value}%`);
        }
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      hls.destroy();
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [src]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setProgress(newTime);
  };
  
  const handleSeek = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const date = new Date(0);
    date.setSeconds(timeInSeconds);
    const timeString = date.toISOString().substr(11, 8);
    return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
  };
  
  const toggleFullscreen = useCallback(() => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlTimeout);
    controlTimeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3000);
  };

  const handleSetPlaybackRate = (rate: number) => {
    if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        setActiveSettingsMenu('main');
    }
  }
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return;
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                handleSeek(10);
                break;
            case 'ArrowLeft':
                handleSeek(-10);
                break;
            case 'KeyF':
                toggleFullscreen();
                break;
        }
    }
    window.addEventListener('keydown', handleKeyDown);

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    function handleClickOutside(event: MouseEvent) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [togglePlayPause, toggleFullscreen]);

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) {
            setShowControls(false);
            setShowSettings(false);
        }
      }}
      className="relative w-full aspect-video bg-black flex justify-center items-center group"
    >
      <video ref={videoRef} className="w-full h-full" onClick={togglePlayPause} />
      <div
        ref={controlsRef}
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <input
            ref={progressRef}
            type="range"
            min="0"
            max={duration}
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 appearance-none bg-gray-600/50 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full"
            style={{backgroundSize: `${(progress / duration) * 100}% 100%`}}
        />

        <div className="flex items-center justify-between text-white mt-2">
            <div className="flex items-center gap-4">
                <button onClick={() => handleSeek(-10)}><Rewind size={20} /></button>
                <button onClick={togglePlayPause}>
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={() => handleSeek(10)}><FastForward size={20} /></button>
            </div>

            <div className="flex items-center gap-4">
                 <span>{formatTime(progress)} / {formatTime(duration)}</span>
                 <div className="relative" ref={settingsMenuRef}>
                    <button onClick={() => setShowSettings(!showSettings)}>
                        <Settings size={20} />
                    </button>
                    {showSettings && (
                        <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg p-2 min-w-[150px] text-sm">
                           {activeSettingsMenu === 'main' && (
                                <>
                                    <button className="w-full text-left p-2 hover:bg-white/10 rounded-md flex justify-between">
                                        <span>Quality</span>
                                        <span className="text-gray-400">Auto</span>
                                    </button>
                                    <button onClick={() => setActiveSettingsMenu('speed')} className="w-full text-left p-2 hover:bg-white/10 rounded-md flex justify-between">
                                        <span>Speed</span>
                                        <span className="text-gray-400">{playbackRate}x</span>
                                    </button>
                                </>
                           )}
                           {activeSettingsMenu === 'speed' && (
                                <>
                                    <button onClick={() => setActiveSettingsMenu('main')} className="w-full text-left p-2 mb-1 border-b border-gray-600">Speed</button>
                                    {playbackSpeeds.map(speed => (
                                        <button key={speed} onClick={() => handleSetPlaybackRate(speed)} className="w-full text-left p-2 hover:bg-white/10 rounded-md flex items-center gap-2">
                                            {playbackRate === speed && <Check size={16} />}
                                            <span className={playbackRate !== speed ? 'ml-6' : ''}>{speed}x</span>
                                        </button>
                                    ))}
                                </>
                           )}
                        </div>
                    )}
                 </div>
                <button onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
