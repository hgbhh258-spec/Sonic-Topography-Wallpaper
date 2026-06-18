import React, { useMemo, useEffect, useState, useRef } from 'react';
import { parseLRC } from '../../lib/lyrics';

interface LyricsDisplayProps {
  lrcText: string;
  currentTime: number;
  accentHex?: string;
  isPlaying?: boolean;
  shifted?: boolean;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lrcText, currentTime, accentHex = '#00ffff', isPlaying = true, shifted = false }) => {
  const lyrics = useMemo(() => parseLRC(lrcText), [lrcText]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [reduceEffects, setReduceEffects] = useState(true);
  const ROW_HEIGHT = 64;

  const activeIndex = useMemo(() => {
    let newIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time - 0.2) { // 0.2s anticipation
            newIndex = i;
        } else {
            break;
        }
    }
    return newIndex;
  }, [currentTime, lyrics]);

  useEffect(() => {
    setReduceEffects(true);
    const timer = setTimeout(() => setReduceEffects(false), 300);

    if (!containerRef.current) {
      setOffsetY(0);
      return () => clearTimeout(timer);
    }

    const containerCenter = containerRef.current.clientHeight / 2;
    const leadIn = 72;
    const index = activeIndex >= 0 ? activeIndex : -1;
    const target = index >= 0
      ? containerCenter - ((index + 0.5) * ROW_HEIGHT)
      : containerCenter + leadIn - (ROW_HEIGHT / 2);

    setOffsetY(target);
    return () => clearTimeout(timer);
  }, [activeIndex, lyrics]);

  if (lyrics.length === 0) return null;

  return (
    <div 
        ref={containerRef}
        className={`absolute top-[40vh] -translate-y-1/2 h-[60vh] w-[800px] overflow-hidden pointer-events-none select-none z-40 transition-all duration-[800ms] ease-out ${
            shifted ? 'left-[320px]' : 'left-[40px]'
        } ${isPlaying ? 'opacity-100 translate-x-0 blur-none' : 'opacity-0 -translate-x-[20px] blur-sm'}`}
        style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            perspective: '1200px',
            perspectiveOrigin: 'left center',
            contain: 'layout paint style'
        }}
    >
      <div 
        className="px-[40px] flex flex-col relative w-full h-full" 
        style={{
            transform: 'rotateY(20deg) rotateX(5deg) translateZ(-50px)',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
        }}
      >
        <div 
            ref={scrollWrapperRef}
            className="flex flex-col relative w-full"
            style={{ 
                transform: `translateY(${offsetY}px)`,
                transition: 'transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                willChange: 'transform'
            }}
        >
            {/* Continuous vertical timeline line */}
            <div className="absolute left-[8px] top-0 bottom-0 w-[1px] bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>

            {lyrics.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;
              return (
                <div
                  key={idx}
                  className="relative pl-[40px] h-[64px] w-full transition-[opacity,transform,color] duration-300 ease-out flex items-center"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[8px] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                     {isActive ? (
                        <div 
                          className="w-4 h-4 rounded-full border-[2px] flex items-center justify-center bg-black/50 transition-all duration-500 ease-out"
                          style={{ borderColor: accentHex, color: accentHex, boxShadow: `0 0 15px ${accentHex}88` }}
                        >
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentHex }}></div>
                        </div>
                     ) : (
                        <div className="w-[3px] h-[3px] rounded-full bg-white/20 transition-all duration-500 ease-out" style={{ boxShadow: isPast ? `0 0 5px ${accentHex}44` : 'none', backgroundColor: isPast ? accentHex : 'rgba(255,255,255,0.2)' }}></div>
                     )}
                  </div>

                  {/* Lyric Text */}
                  <div
                    className={`transition-[opacity,transform,color] duration-300 ease-out whitespace-pre-wrap font-serif tracking-[0.05em] ${
                        isActive 
                            ? 'text-white text-[30px] font-medium opacity-100' 
                            : isPast
                                ? 'text-white/24 text-[18px] font-normal opacity-45' 
                                : 'text-white/40 text-[18px] font-normal opacity-50'
                    }`}
                    style={{
                        transform: isActive ? 'translateY(0) scale(1.02)' : 'translateY(0) scale(1)',
                        transformOrigin: 'left center',
                        textShadow: isActive
                          ? (reduceEffects ? '0 1px 2px rgba(0,0,0,0.45)' : `0 0 10px ${accentHex}44`)
                          : '0 1px 2px rgba(0,0,0,0.45)',
                        willChange: 'transform, opacity'
                    }}
                  >
                    {line.text}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
