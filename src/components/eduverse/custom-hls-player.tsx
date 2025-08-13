
'use client';

import { useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Maximize, Minimize, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CustomHlsPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [videoSrc, setVideoSrc] = useState(src);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);


  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getQualityUrl = (originalUrl: string, quality: string): string => {
    if (quality === 'Auto') return originalUrl;
    
    const url = new URL(originalUrl);
    const pathParts = url.pathname.split('/');
    const masterPlaylistName = pathParts.pop() || '';

    if (masterPlaylistName.includes('index_') || masterPlaylistName.includes('_')) {
        const qualityMap: {[key: string]: string} = {
            '720p': '4', '1080p': '5', '480p': '3', '360p': '2', '240p': '1'
        };
        const qualityLevel = qualityMap[quality] || '4'; 

        if (masterPlaylistName.includes('index_')) {
            const newPlaylist = masterPlaylistName.replace(/index_(\d+)\.m3u8/, `index_${qualityLevel}.m3u8`);
            if (!/index_\d+\.m3u8/.test(masterPlaylistName)) {
                 pathParts.push(`index_${qualityLevel}.m3u8`);
            } else {
                 pathParts.push(newPlaylist);
            }
        } else if (masterPlaylistName.includes('VOD')) {
             const newPlaylist = masterPlaylistName.replace(/VOD\d+p30\.m3u8/, `VOD${quality.replace('p','')}p30.m3u8`);
              if (!/VOD\d+p30\.m3u8/.test(masterPlaylistName)) {
                pathParts.push(`VOD${quality.replace('p','')}p30.m3u8`);
              } else {
                pathParts.push(newPlaylist);
              }
        }
        else {
             pathParts.push(masterPlaylistName);
        }
    }

    url.pathname = pathParts.join('/');
    return url.toString();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
        hlsRef.current.destroy();
    }

    const hls = new Hls();
    hlsRef.current = hls;
    
    if (Hls.isSupported()) {
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (data.levels.length > 1) {
          const qualities = data.levels.map(level => `${level.height}p`);
          setAvailableQualities(['Auto', ...qualities]);
        } else {
          setAvailableQualities([]);
        }

        if(isPlaying) video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if(isPlaying) video.play();
      });
    }

    const handleTimeUpdate = () => {
      if(video.duration > 0 && isFinite(video.duration)) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleDurationChange = () => {
      if(video.duration > 0 && isFinite(video.duration)) {
        setDuration(video.duration);
      }
    }
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      if (hlsRef.current) {
          hlsRef.current.destroy();
      }
    };
  }, [src]);
  
  useEffect(() => {
    if (!Hls.isSupported() || !hlsRef.current) return;

    const wasPlaying = isPlaying;
    const currentPlaybackTime = videoRef.current?.currentTime || 0;

    if (currentQuality === 'Auto') {
        hlsRef.current.currentLevel = -1; // Auto quality
    } else {
        const qualityIndex = availableQualities.slice(1).indexOf(currentQuality);
        if (qualityIndex !== -1) {
            hlsRef.current.currentLevel = qualityIndex;
        }
    }

    if (wasPlaying && videoRef.current) {
        videoRef.current.currentTime = currentPlaybackTime;
        videoRef.current.play().catch(() => setIsPlaying(false));
    }

}, [videoSrc, currentQuality, availableQualities, isPlaying]);


  useEffect(() => {
    const video = videoRef.current;
    if(video && src) {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [src]);

  const changeQuality = (quality: string) => {
    if (quality === currentQuality) {
      setQualityMenuOpen(false);
      setSettingsOpen(false);
      return;
    };

    const video = videoRef.current;
    if (!video) return;

    setCurrentQuality(quality);

    if (hlsRef.current && Hls.isSupported()) {
        if (quality === 'Auto') {
            hlsRef.current.currentLevel = -1; // -1 enables auto quality switching
        } else {
            const qualityIndex = availableQualities.slice(1).indexOf(quality);
            if (qualityIndex !== -1) {
                hlsRef.current.currentLevel = qualityIndex;
            }
        }
    } else {
       const newSrc = getQualityUrl(src, quality);
       setVideoSrc(newSrc);
    }
    
    setQualityMenuOpen(false);
    setSettingsOpen(false);
  };


  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video && isFinite(duration) && duration > 0) {
      const newProgress = parseFloat(e.target.value);
      const newTime = (newProgress / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(newProgress);
      setCurrentTime(newTime);
    }
  };


  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullScreen = async () => {
    if (!playerRef.current) return;

    try {
        if (!document.fullscreenElement) {
            await playerRef.current.requestFullscreen();
            if (screen.orientation && typeof screen.orientation.lock === 'function') {
                await screen.orientation.lock('landscape');
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
            if (screen.orientation && typeof screen.orientation.unlock === 'function') {
                screen.orientation.unlock();
            }
        }
    } catch (err) {
        console.error("Failed to toggle fullscreen or lock orientation:", err);
    }
  };
  
  useEffect(() => {
    const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if(controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if(isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }

  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      if(controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isPlaying])

  return (
    <div ref={playerRef} className="w-full max-w-4xl mx-auto relative group aspect-video bg-black rounded-lg overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={() => isPlaying && setShowControls(false)}>
      <video ref={videoRef} className="w-full h-full rounded-lg" onClick={togglePlay}></video>
      
      <div className={`absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>

        <div className="absolute bottom-0 left-0 right-0 px-2 sm:px-4 pt-2 pb-1 text-white bg-gradient-to-t from-black/70 to-transparent">
           <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1 accent-red-600 cursor-pointer"
            style={{'--value': `${progress}%`} as React.CSSProperties}
          />
          <div className="flex items-center gap-2 sm:gap-4 mt-1">
            <button onClick={togglePlay} className="p-1">
              {isPlaying ? <Pause size={20} className="sm:w-6 sm:h-6" /> : <Play size={20} className="sm:w-6 sm:h-6" />}
            </button>
            <div className="text-xs sm:text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="flex-grow"></div>

            <Dialog open={settingsOpen} onOpenChange={(open) => { setSettingsOpen(open); if(!open) setQualityMenuOpen(false); }}>
              <DialogTrigger asChild>
                 <button className="p-1" disabled={availableQualities.length === 0}>
                   <Settings size={20} className={`sm:w-6 sm:h-6 ${availableQualities.length === 0 ? 'text-gray-500' : ''}`} />
                 </button>
              </DialogTrigger>
              <DialogContent className="bg-black bg-opacity-80 border-none text-white p-2 w-64">
                <DialogTitle className="sr-only">Video Settings</DialogTitle>
                {qualityMenuOpen ? (
                    <div>
                        <Button variant="ghost" className="w-full text-sm justify-start text-white hover:bg-gray-700" onClick={() => setQualityMenuOpen(false)}>
                            &lt; Quality
                        </Button>
                        {availableQualities.map(quality => (
                             <Button
                                key={quality}
                                variant="ghost"
                                className={`w-full text-sm justify-start text-white hover:bg-gray-700 ${currentQuality === quality ? 'font-bold' : ''}`}
                                onClick={() => changeQuality(quality)}
                            >
                                {quality} {quality !== 'Auto' && `(${quality === '720p' ? 'High' : 'Low'})`}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <Button variant="ghost" className="w-full text-sm justify-between text-white hover:bg-gray-700" onClick={() => setQualityMenuOpen(true)}>
                        <span>Quality</span>
                        <span>{currentQuality} &gt;</span>
                    </Button>
                )}
              </DialogContent>
            </Dialog>
            <button onClick={toggleFullScreen} className="p-1">
              {isFullScreen ? <Minimize size={20} className="sm:w-6 sm:h-6" /> : <Maximize size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
