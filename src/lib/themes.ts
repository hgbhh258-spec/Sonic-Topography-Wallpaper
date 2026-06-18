import * as THREE from 'three';

export interface ThemeColors {
  name: string;
  id: string;
  uBaseColor1: THREE.Color;
  uBaseColor2: THREE.Color;
  uCoolCore: THREE.Color;
  uCoolEdge: THREE.Color;
  uWarmCore: THREE.Color;
  uWarmEdge: THREE.Color;
  uRippleColor: THREE.Color;
  uGlowIntensity: number;
}

export const themes: Record<string, ThemeColors> = {
  'nocturnal': {
    name: 'Nocturnal',
    id: 'nocturnal',
    uBaseColor1: new THREE.Color(0.01, 0.02, 0.04),
    uBaseColor2: new THREE.Color(0.03, 0.05, 0.09),
    uCoolCore: new THREE.Color(0.0, 0.3, 1.0),
    uCoolEdge: new THREE.Color(0.6, 0.2, 1.0),
    uWarmCore: new THREE.Color(1.0, 0.2, 0.1),
    uWarmEdge: new THREE.Color(1.0, 0.6, 0.0),
    uRippleColor: new THREE.Color(0.2, 0.9, 1.0),
    uGlowIntensity: 1.0,
  },
  'neon-tokyo': {
    name: 'Neon Tokyo',
    id: 'neon-tokyo',
    uBaseColor1: new THREE.Color(0.01, 0.005, 0.02),
    uBaseColor2: new THREE.Color(0.04, 0.01, 0.06),
    uCoolCore: new THREE.Color(1.0, 0.1, 0.6), // Hot pink
    uCoolEdge: new THREE.Color(0.6, 0.1, 1.0), // Deep purple
    uWarmCore: new THREE.Color(0.1, 1.0, 0.8), // Mint cyan
    uWarmEdge: new THREE.Color(0.1, 0.4, 1.0), // Royal blue
    uRippleColor: new THREE.Color(1.0, 1.0, 1.0),
    uGlowIntensity: 1.5,
  },
  'cyber-forest': {
    name: 'Cyber Forest',
    id: 'cyber-forest',
    uBaseColor1: new THREE.Color(0.01, 0.02, 0.01),
    uBaseColor2: new THREE.Color(0.02, 0.05, 0.02),
    uCoolCore: new THREE.Color(0.1, 1.0, 0.5), // Bright emerald
    uCoolEdge: new THREE.Color(0.05, 0.5, 0.3), // Dark green
    uWarmCore: new THREE.Color(0.8, 1.0, 0.1), // Lime yellow
    uWarmEdge: new THREE.Color(0.9, 0.5, 0.1), // Orange
    uRippleColor: new THREE.Color(0.6, 1.0, 0.3),
    uGlowIntensity: 1.3,
  },
  'minimal-monochrome': {
    name: 'Minimal Monochrome',
    id: 'minimal-monochrome',
    uBaseColor1: new THREE.Color(0.02, 0.02, 0.02),
    uBaseColor2: new THREE.Color(0.06, 0.06, 0.06),
    uCoolCore: new THREE.Color(0.9, 0.9, 0.9), // Bright silver
    uCoolEdge: new THREE.Color(0.4, 0.4, 0.4), // Mid grey
    uWarmCore: new THREE.Color(1.0, 1.0, 1.0), // Pure white
    uWarmEdge: new THREE.Color(0.7, 0.7, 0.7), // Light grey
    uRippleColor: new THREE.Color(1.0, 1.0, 1.0),
    uGlowIntensity: 0.8,
  }
};
