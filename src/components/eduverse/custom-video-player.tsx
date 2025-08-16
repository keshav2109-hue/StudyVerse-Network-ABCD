
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Maximize, Minimize, Settings, Check, Forward, Rewind } from 'lucide-react';
import Image from 'next/image';

interface CustomVideoPlayerProps {
  src: string;
}

const qualityLevels = {
    '720p': 'HD',
    '480p': '',
    '240p': '',
};

export type Quality = keyof typeof qualityLevels;

export const getQualityUrl = (baseUrl: string, quality: Quality): string => {
    // Treat the original URL as 720p
    if (quality === '720p') {
        return baseUrl;
    }

    // Pattern 1 & 3: .../index_X.m3u8 or .../something.m3u8
    if (baseUrl.includes('/channel_vod_non_drm_hls/')) {
        const base = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
        switch (quality) {
            case '240p': return `${base}index_1.m3u8`;
            case '480p': return `${base}index_3.m3u8`;
            default: return baseUrl; // Fallback to original if something is wrong
        }
    }

    // Pattern 2 & 4: ..._video_VOD...
    if (baseUrl.includes('/vod_non_drm_ios/')) {
        // Regex to find and replace the quality part of the URL
        const qualityRegex = /_video_VOD(\d+p\d+)?\.m3u8$/;
        // Base URL is the part before the quality identifier
        const base = baseUrl.replace(qualityRegex, '_video_VOD');

        if (base.endsWith('_video_VOD')) {
             switch (quality) {
                case '240p': return `${base}240p30.m3u8`;
                case '480p': return `${base}480p30.m3u8`;
                default: return baseUrl; // Fallback to original
            }
        }
    }
    
    // If no pattern matches, return the original URL
    return baseUrl; 
};

export const getAvailableQualities = (url: string): Quality[] => {
    // For now, we assume all qualities are available for all video types.
    // A more advanced implementation might check if these URLs are valid.
    return ['720p', '480p', '240p'];
}


export function CustomVideoPlayer({ src: initialSrc }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const [src, setSrc] = useState(initialSrc);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsMenu, setActiveSettingsMenu] = useState<'main' | 'speed' | 'quality'>('main');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [seekIndicator, setSeekIndicator] = useState<'forward' | 'rewind' | null>(null);
  
  const [availableQualities, setAvailableQualities] = useState<Quality[]>([]);
  const [currentQuality, setCurrentQuality] = useState<Quality>('720p');


  useEffect(() => {
    setAvailableQualities(getAvailableQualities(initialSrc));
    // Auto-select best quality initially, which is the original src
    const initialQuality: Quality = '720p';
    setCurrentQuality(initialQuality);
    setSrc(getQualityUrl(initialSrc, initialQuality));
  }, [initialSrc]);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = hlsRef.current;

    const wasPlaying = isPlaying;

    if (Hls.isSupported()) {
        if (hls) {
            hls.destroy();
        }
        hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
            const wasPlaying = !video.paused;
            if (wasPlaying || video.autoplay) {
                video.play().catch(e => console.error("Autoplay was prevented:", e));
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
            const wasPlaying = !video.paused;
            if (wasPlaying || video.autoplay) {
                video.play().catch(e => console.error("Autoplay was prevented:", e));
            }
        });
    }
    const handleTimeUpdate = () => {
        if(video.duration) {
            setProgress(video.currentTime);
            if (progressRef.current) {
                const value = (video.currentTime / video.duration) * 100;
                progressRef.current.style.setProperty('--value', `${value}%`);
            }
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
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
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
      setSeekIndicator(amount > 0 ? 'forward' : 'rewind');
      setTimeout(() => setSeekIndicator(null), 500);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return '00:00';
    }
    const date = new Date(0);
    date.setSeconds(timeInSeconds);
    const timeString = date.toISOString().substr(11, 8);
    return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
  };
  
  const toggleFullscreen = useCallback(() => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(err => {
                    console.warn("Could not lock screen orientation:", err);
                });
            }
        }).catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
  }, []);

  const hideControls = () => {
    if (videoRef.current && !videoRef.current.paused) {
      setShowControls(false);
    }
  };

  const showAndAutoHideControls = useCallback(() => {
    setShowControls(true);
    if (controlTimeoutRef.current) {
      clearTimeout(controlTimeoutRef.current);
    }
    controlTimeoutRef.current = setTimeout(hideControls, 3000);
  }, []);

  useEffect(() => {
    const container = playerContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', showAndAutoHideControls);
      container.addEventListener('mouseleave', hideControls);
    }

    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
      if (container) {
        container.removeEventListener('mousemove', showAndAutoHideControls);
        container.removeEventListener('mouseleave', hideControls);
      }
    };
  }, [showAndAutoHideControls]);


  const handleSetPlaybackRate = (rate: number) => {
    if (videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
    }
  }

  const handleSetQuality = (quality: Quality) => {
    if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const wasPlaying = isPlaying;

        setCurrentQuality(quality);
        setSrc(getQualityUrl(initialSrc, quality));

        const video = videoRef.current;
        
        const onLoadedMetadata = () => {
            video.currentTime = currentTime;
            if (wasPlaying) {
                video.play().catch(e => console.error("Play after quality switch failed", e));
            }
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
        };
        video.addEventListener('loadedmetadata', onLoadedMetadata);

        setActiveSettingsMenu('main');
        setShowSettings(false);
    }
  }
  
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = playerContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const midpoint = container.offsetWidth / 2;

    if (clickX > midpoint) {
        handleSeek(10);
    } else {
        handleSeek(-10);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) return;
        e.preventDefault();
        showAndAutoHideControls();
        switch (e.code) {
            case 'Space':
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
      const target = event.target as Node;
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(target) && !controlsRef.current?.contains(target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [togglePlayPause, toggleFullscreen, showAndAutoHideControls]);

  return (
    <div
      ref={playerContainerRef}
      className="relative w-full aspect-video bg-black flex justify-center items-center group rounded-lg overflow-hidden"
      onDoubleClick={handleDoubleClick}
    >
      <video ref={videoRef} className="w-full h-full" onClick={togglePlayPause} onPlay={showAndAutoHideControls} onPause={() => setShowControls(true)}/>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {seekIndicator && (
            <div className="absolute bg-black/50 text-white rounded-full p-4 flex flex-col items-center gap-1 transition-opacity duration-300 opacity-100 animate-ping-once">
                {seekIndicator === 'forward' ? <Forward size={40} /> : <Rewind size={40} />}
                <span className="text-sm font-bold">10s</span>
            </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
          className={`pointer-events-auto bg-black/50 text-white rounded-full p-4 transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          {isPlaying ? <Pause size={40} /> : <Play size={40} className="translate-x-[2px]"/>}
        </button>
      </div>

       <div className="absolute top-4 right-4 z-10 opacity-70">
          <Image src="https://i.postimg.cc/rsKZhQbz/image.png" alt="Eduverse Logo" width={80} height={80} className="rounded-full" />
       </div>

      <div
        ref={controlsRef}
        onClick={(e) => e.stopPropagation()} 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col gap-2">
           <input
                ref={progressRef}
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleProgressChange}
                className="w-full"
            />
            <div className="flex items-center gap-4 text-white">
                <div className="text-xs text-white">
                    {formatTime(progress)} / {formatTime(duration)}
                </div>
                <div className="flex-grow"></div>
                <div className="relative">
                    <button onClick={() => { setShowSettings(prev => !prev); setActiveSettingsMenu('main'); }}>
                        <Settings size={20} />
                    </button>
                    {showSettings && (
                        <div ref={settingsMenuRef} className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg p-2 min-w-[180px] text-sm">
                        {activeSettingsMenu === 'main' && (
                                <>
                                    <button onClick={() => setActiveSettingsMenu('quality')} className="w-full text-left p-2 hover:bg-white/10 rounded-md flex justify-between">
                                        <span>Quality</span>
                                        <span className="text-gray-400">{currentQuality} {qualityLevels[currentQuality as Quality] && `(${qualityLevels[currentQuality as Quality]})`}</span>
                                    </button>
                                    <button onClick={() => setActiveSettingsMenu('speed')} className="w-full text-left p-2 hover:bg-white/10 rounded-md flex justify-between">
                                        <span>Speed</span>
                                        <span className="text-gray-400">{playbackRate.toFixed(2)}x</span>
                                    </button>
                                </>
                        )}
                        {activeSettingsMenu === 'speed' && (
                                <div className="p-2">
                                     <button onClick={() => setActiveSettingsMenu('main')} className="w-full text-left p-2 mb-1 border-b border-gray-600 text-base font-semibold">Speed</button>
                                    <div className="flex justify-between items-center my-2">
                                        <span>Custom ({playbackRate.toFixed(2)}x)</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.25"
                                        max="3"
                                        step="0.25"
                                        value={playbackRate}
                                        onChange={(e) => handleSetPlaybackRate(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                        )}
                        {activeSettingsMenu === 'quality' && (
                                <>
                                    <button onClick={() => setActiveSettingsMenu('main')} className="w-full text-left p-2 mb-1 border-b border-gray-600">Quality</button>
                                    {availableQualities.map(q => (
                                        <button key={q} onClick={() => handleSetQuality(q)} className="w-full text-left p-2 hover:bg-white/10 rounded-md flex items-center gap-2">
                                            {currentQuality === q && <Check size={16} />}
                                            <span className={currentQuality !== q ? 'ml-6' : ''}>{q} {qualityLevels[q] && `(${qualityLevels[q]})`}</span>
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
