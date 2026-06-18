export interface AudioData {
  // Legacy base
  bass: number;
  mid: number;
  treble: number;
  energy: number;

  // Granular bands
  subBass: number;   // 20-60Hz
  lowMid: number;    // 140-300Hz
  highMid: number;   // 800-2kHz
  presence: number;  // 2-4kHz
  brilliance: number;// 4-8kHz
  air: number;       // 8-16kHz

  // Timbral Metrics
  warmth: number;
  brightness: number;
  sharpness: number;
  smoothness: number;
  density: number;
  spectralCentroid: number;
}

export interface RippleEvent {
  pos: [number, number];
  time: number;
  strength: number;
  isActive: boolean;
}

export interface TrackInfo {
  name: string;
  artist: string;
  duration: number; // in seconds
  file?: File;
  url?: string;
}
