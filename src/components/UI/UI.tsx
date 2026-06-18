import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, SkipForward, SkipBack, Palette, Upload } from 'lucide-react';
import { engine } from '../../lib/AudioEngine';
import { themes } from '../../lib/themes';
import { LyricsDisplay } from './LyricsDisplay';
import { extractLyricsFromAudio } from '../../lib/metadata';

interface UIProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

function formatTime(time: number) {
  if (Number.isNaN(time)) return '0:00';
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function parseDemoMetadata(text: string) {
  const firstLine = text.split('\n').find((line) => line.trim()) || '';
  const match = firstLine.match(/^\[\d{2}:\d{2}\.\d{2}\](.+)$/);
  const rawTitle = (match?.[1] || '').trim();
  const [title, artist] = rawTitle.split(' - ');
  return {
    title: title?.trim() || 'Demo Track',
    artist: artist?.trim() || 'Demo',
  };
}

function parseLrcMetadata(text: string) {
  const firstLine = text.split('\n').find((line) => line.trim()) || '';
  const match = firstLine.match(/^\[\d{2}:\d{2}\.\d{2}\](.+)$/);
  const rawTitle = (match?.[1] || '').trim();
  const [title, artist] = rawTitle.split(' - ');
  return {
    title: title?.trim() || 'Track',
    artist: artist?.trim() || 'Demo',
  };
}

export function UI({ theme, onThemeChange }: UIProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackName, setTrackName] = useState<string>('No track selected');
  const [trackArtist, setTrackArtist] = useState<string>('Demo');
  const [demoTitle, setDemoTitle] = useState<string>('Demo Track');
  const [demoArtist, setDemoArtist] = useState<string>('Demo');
  const [lyricsText, setLyricsText] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const initEngine = async () => {
      await engine.init();
    };
    initEngine();

    fetch('./Demo Subtitles.lrc')
      .then((response) => (response.ok ? response.text() : ''))
      .then((text) => {
        if (!text) return;
        const meta = parseDemoMetadata(text);
        setDemoTitle(meta.title);
        setDemoArtist(meta.artist);
      })
      .catch(() => {
        setDemoTitle('Demo Track');
        setDemoArtist('Demo');
      });

    const audio = engine.audioElement;
    let progressTimer: ReturnType<typeof setTimeout> | null = null;

    const syncPlaybackState = () => {
      setIsPlaying(audio.paused ? false : true);
      setDuration(audio.duration || 0);
      setVolume(audio.volume);
      setIsCapturing(engine.isCapturing);
    };

    const syncCurrentTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const startProgressLoop = () => {
      if (progressTimer) return;
      const tick = () => {
        syncCurrentTime();
        progressTimer = setTimeout(tick, 250);
      };
      tick();
    };

    const stopProgressLoop = () => {
      if (progressTimer) {
        clearTimeout(progressTimer);
        progressTimer = null;
      }
    };

    const handlePlay = () => {
      syncPlaybackState();
      startProgressLoop();
    };
    const handlePause = () => {
      syncPlaybackState();
      stopProgressLoop();
    };
    const handleLoadedMetadata = syncPlaybackState;
    const handleVolumeChange = syncPlaybackState;
    const handleEnded = () => {
      syncPlaybackState();
      stopProgressLoop();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.addEventListener('ended', handleEnded);

    const captureTimer = setInterval(() => {
      setIsCapturing(engine.isCapturing);
      if (typeof performance !== 'undefined') {
        if (typeof performance.clearMeasures === 'function') {
          performance.clearMeasures();
        }
        if (typeof performance.clearMarks === 'function') {
          performance.clearMarks();
        }
      }
    }, 1000);

    return () => {
      clearInterval(captureTimer);
      stopProgressLoop();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const loadDemo = () => {
    const demoAudioUrl = './SoundHelix-Song-1.mp3';
    const demoSubtitleUrl = './Demo Subtitles.lrc';
    engine.init();
    engine.loadUrl(demoAudioUrl);
    fetch(demoSubtitleUrl)
      .then((response) => (response.ok ? response.text() : ''))
      .then((text) => {
        setLyricsText(text || '');
        const meta = parseDemoMetadata(text);
        setTrackName(`${meta.title} - ${meta.artist}`);
        setTrackArtist(meta.artist);
        setDemoTitle(meta.title);
        setDemoArtist(meta.artist);
      })
      .catch(() => {
        setLyricsText('');
        setTrackName(`${demoTitle} - ${demoArtist}`);
        setTrackArtist(demoArtist);
      });
    engine.play();
  };

  const togglePlay = () => {
    engine.init();
    engine.togglePlay();
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const audioFiles: File[] = [];
    const lrcFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.flac')) {
        audioFiles.push(file);
      } else if (file.name.endsWith('.lrc')) {
        lrcFiles.push(file);
      }
    }

    const newLyricsMap = new Map<string, string>();
    for (const file of lrcFiles) {
      const text = await file.text();
      newLyricsMap.set(file.name.replace(/\.[^/.]+$/, ''), text);
    }

    if (audioFiles.length > 0) {
      const audioFile = audioFiles[0];
      engine.init();
      engine.loadFile(audioFile);
      engine.play();

      const baseName = audioFile.name.replace(/\.[^/.]+$/, '');
      const matchedLyrics = newLyricsMap.get(baseName);
      if (matchedLyrics) {
        setLyricsText(matchedLyrics);
        const meta = parseLrcMetadata(matchedLyrics);
        setTrackName(meta.title);
        setTrackArtist(meta.artist);
      } else {
        setTrackName(baseName);
        setTrackArtist('Demo');
        setLyricsText('');
        const extractedLyrics = await extractLyricsFromAudio(audioFile);
        if (extractedLyrics) {
          setLyricsText(extractedLyrics);
        }
      }
    } else if (lrcFiles.length > 0) {
      const firstLyrics = newLyricsMap.values().next().value;
      const text = firstLyrics || '';
      setLyricsText(text);
      if (text) {
        const meta = parseLrcMetadata(text);
        setTrackName(meta.title);
        setTrackArtist(meta.artist);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        engine.init();
        engine.togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleDragOverGlobal = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeaveGlobal = (e: DragEvent) => {
      e.preventDefault();
      if (e.clientX === 0 || e.clientY === 0) {
        setIsDragging(false);
      }
    };

    const handleDropGlobal = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer?.files || null);
    };

    window.addEventListener('dragover', handleDragOverGlobal);
    window.addEventListener('dragleave', handleDragLeaveGlobal);
    window.addEventListener('drop', handleDropGlobal);

    return () => {
      window.removeEventListener('dragover', handleDragOverGlobal);
      window.removeEventListener('dragleave', handleDragLeaveGlobal);
      window.removeEventListener('drop', handleDropGlobal);
    };
  }, []);

  const t = themes[theme] || themes.nocturnal;
  const accentHex = `#${t.uRippleColor.getHexString()}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 flex w-full h-full"
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#94a3b8' }}
    >
      {isDragging && (
        <div
          className="absolute inset-0 z-[60] backdrop-blur-sm border-2 border-dashed m-4 rounded-xl flex items-center justify-center font-mono text-2xl tracking-widest pointer-events-none"
          style={{ backgroundColor: `${accentHex}1a`, borderColor: accentHex, color: accentHex }}
        >
          DROP AUDIO FILE TO PLAY
        </div>
      )}

      <div className="absolute top-[40px] left-[40px] font-black text-[24px] tracking-[-1px] text-white z-50 select-none">
        AETHER.
      </div>

      <div
        className="absolute top-[40px] right-[40px] w-[300px] p-6 rounded-sm z-50 pointer-events-auto backdrop-blur-[20px] border border-white/10"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="text-[18px] font-light tracking-[0.05em] text-white truncate" title={trackName}>
            {trackName === 'No track selected' ? demoTitle : trackName}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
              title="Upload Audio/Lyrics"
            >
              <Upload size={16} />
            </button>
            <button
              onClick={() => {
                const keys = Object.keys(themes);
                const nextIndex = (keys.indexOf(theme) + 1) % keys.length;
                onThemeChange(keys[nextIndex]);
              }}
              className="text-white/40 hover:text-white transition-colors"
              title="Change Theme"
            >
              <Palette size={16} />
            </button>
          </div>
        </div>

        <div className="text-[12px] opacity-50 uppercase mb-6 tracking-wider">
          {isCapturing
            ? 'System Audio Capture'
            : trackName !== 'No track selected'
              ? trackArtist
              : demoArtist}
        </div>

        {trackName === 'No track selected' ? (
          <button
            onClick={loadDemo}
            className="w-full py-2 text-[10px] uppercase tracking-[0.18em] bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            PLAY
          </button>
        ) : (
          <>
            <div className={`h-[20px] mb-5 relative flex items-end group ${isCapturing ? 'opacity-30 pointer-events-none' : ''}`}>
              <div className="w-full relative h-[2px] bg-white/10 group-hover:h-[4px] transition-all">
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    backgroundColor: accentHex,
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    boxShadow: `0 0 10px ${accentHex}88`,
                  }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step="0.01"
                value={currentTime}
                onChange={(e) => {
                  if (engine.audioElement) {
                    const newTime = parseFloat(e.target.value);
                    engine.audioElement.currentTime = newTime;
                    setCurrentTime(newTime);
                  }
                }}
                className="absolute bottom-0 left-0 w-full opacity-0 cursor-pointer h-full"
              />
            </div>

            <div className={`flex justify-between items-center text-[10px] uppercase tracking-[0.1em] opacity-80 ${isCapturing ? 'opacity-30 pointer-events-none' : ''}`}>
              <span className="w-8">{formatTime(currentTime)}</span>
              <div className="flex items-center gap-4">
                <button className="hover:text-white transition-colors">
                  <SkipBack size={14} />
                </button>
                <button onClick={togglePlay} className="hover:text-white transition-colors">
                  {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current" />}
                </button>
                <button className="hover:text-white transition-colors">
                  <SkipForward size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2 group w-20 justify-end">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    engine.audioElement.volume = val;
                    setVolume(val);
                  }}
                  className="w-12 h-1 accent-current opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer aspect-auto bg-white/20 appearance-none rounded-full"
                  style={{ accentColor: accentHex }}
                />
                <Volume2
                  size={12}
                  className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
                  onClick={() => {
                    const val = volume > 0 ? 0 : 1;
                    engine.audioElement.volume = val;
                    setVolume(val);
                  }}
                />
              </div>
              <span className="w-8 text-right">{formatTime(duration)}</span>
            </div>
          </>
        )}
      </div>

      {trackName !== 'No track selected' && lyricsText && (
        <LyricsDisplay lrcText={lyricsText} currentTime={currentTime} accentHex={accentHex} isPlaying={isPlaying} shifted={false} />
      )}

      <div className="absolute bottom-[40px] left-[40px] z-50 pointer-events-none flex flex-col gap-6">
        <StatsPanel accentHex={accentHex} isPlaying={isPlaying} />
      </div>

      <div className="absolute bottom-[40px] right-[40px] text-[10px] uppercase tracking-[0.1em] opacity-30 select-none">
        Drag to orbit • Click to pulse
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*,.lrc"
        multiple
        className="hidden"
        onChange={(e) => {
          processFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function StatsPanel({ accentHex, isPlaying }: { accentHex: string; isPlaying: boolean }) {
  const [data, setData] = useState({ bass: 0, mid: 0, treble: 0, energy: 0 });

  useEffect(() => {
    if (!isPlaying) {
      setData({ bass: 0, mid: 0, treble: 0, energy: 0 });
      return;
    }
    let animationFrameId: number;
    const poll = () => {
      setData(engine.getAudioData());
      animationFrameId = requestAnimationFrame(poll);
    };
    poll();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  return (
    <div className="flex gap-10">
      <StatBox label="Bass" value={data.bass} accentHex={accentHex} />
      <StatBox label="Mid" value={data.mid} accentHex={accentHex} />
      <StatBox label="Treble" value={data.treble} accentHex={accentHex} />
      <StatBox label="Energy" value={data.energy} accentHex={accentHex} />
    </div>
  );
}

function StatBox({ label, value, accentHex }: { label: string; value: number; accentHex: string }) {
  const displayValue = (value * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[9px] uppercase tracking-[0.15em] opacity-40">{label}</div>
      <div className="font-mono text-[14px]" style={{ color: accentHex }}>
        {displayValue}
      </div>
      <div className="w-[100px] h-[2px] relative bg-white/10">
        <div
          className="absolute h-full transition-all duration-75"
          style={{ backgroundColor: accentHex, width: `${Math.min(100, value * 100)}%`, boxShadow: `0 0 8px ${accentHex}88` }}
        />
      </div>
    </div>
  );
}
