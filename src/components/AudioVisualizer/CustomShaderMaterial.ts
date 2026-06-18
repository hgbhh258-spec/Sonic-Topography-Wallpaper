import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

export const MapShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uSubBass: 0,
    uBass: 0,
    uLowMid: 0,
    uMid: 0,
    uHighMid: 0,
    uPresence: 0,
    uBrilliance: 0,
    uAir: 0,
    uWarmth: 0,
    uBrightness: 0,
    uSharpness: 0,
    uSmoothness: 0,
    uDensity: 0,
    uSpectralCentroid: 0,
    uEnergy: 0,
    uRipples: new Array(10).fill({
      pos: new THREE.Vector2(),
      time: 0,
      strength: 0,
      isActive: 0,
      rippleType: 0,
    }),
    uBaseColor1: new THREE.Color(0.01, 0.02, 0.04),
    uBaseColor2: new THREE.Color(0.03, 0.05, 0.09),
    uCoolCore: new THREE.Color(0.0, 0.3, 1.0),
    uCoolEdge: new THREE.Color(0.6, 0.2, 1.0),
    uWarmCore: new THREE.Color(1.0, 0.2, 0.1),
    uWarmEdge: new THREE.Color(1.0, 0.6, 0.0),
    uRippleColor: new THREE.Color(0.2, 0.9, 1.0),
    uGlowIntensity: 1.0,
  },
  // vertex shader
  `
    uniform float uTime;
    
    // Frequency envelopes
    uniform float uSubBass;
    uniform float uBass;
    uniform float uLowMid;
    uniform float uMid;
    uniform float uHighMid;
    
    // Timbral
    uniform float uSmoothness;
    uniform float uDensity;
    uniform float uEnergy;
    
    struct Ripple {
      vec2 pos;
      float time;
      float strength;
      float isActive;
      float rippleType;
    };
    uniform Ripple uRipples[10];

    varying vec2 vUv;
    varying float vElevation;
    varying float vDistance;
    varying vec2 vRippleAnim; // x for normal, y for white
    varying vec3 vNormal;
    varying float vRelativeY;
    varying vec2 vInstancePos;

    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vUv = uv;
      vNormal = normal; 
      
      vec4 instancePos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      vec2 pos2D = instancePos.xz;
      vInstancePos = pos2D;
      
      float centerDist = length(pos2D);
      vDistance = centerDist;
      
      float rnd = random(pos2D);
      
      // 1. Idle Background state (smooth, ocean-like)
      vec2 movingPos = pos2D * 0.05 + vec2(uTime * 0.1, uTime * 0.05);
      float baseNoise = (snoise(movingPos) + 1.0) * 0.5;
      float wave = sin(pos2D.x * 0.15 + pos2D.y * 0.1 - uTime * 0.6) * 0.5 + 0.5;
      
      float globalFalloff = smoothstep(60.0, 30.0, centerDist);
      float idleElevation = mix(baseNoise, wave, uSmoothness * 0.5 + 0.2) * 0.8 * globalFalloff; 

      // 2. Frequency Regions & Displacements

      // Sub-Bass: Center heavy, ultra slow rolling hills, massive block lifts
      float subRegion = smoothstep(25.0, 0.0, centerDist);
      float subLift = uSubBass * subRegion * 5.0; // Reduced from 8.0

      // Bass: Chunk-based lifts, less rigid than sub, but still clustered
      float bassNoise = snoise(pos2D * 0.1 - vec2(0.0, uTime * 0.2));
      float bassRegion = smoothstep(35.0, 5.0, centerDist + bassNoise * 5.0);
      float bassLift = uBass * bassRegion * (smoothstep(0.0, 1.0, rnd + uDensity * 0.5)) * 4.0; // Reduced from 6.0

      // Low Mid: Flowing waves across the whole map slowly
      float lowMidNoise = snoise(pos2D * 0.05 + vec2(uTime * 0.1, 0.0));
      float lowMidLift = uLowMid * (lowMidNoise * 0.5 + 0.5) * 2.5; // Reduced from 4.0

      // Mid: River-like current. Strong diagonal flow.
      float riverFlow = sin(pos2D.x * 0.2 + pos2D.y * 0.2 + snoise(pos2D * 0.1) * 2.0 - uTime * 2.0);
      float midLift = uMid * max(0.0, riverFlow) * 3.0; // Reduced from 5.0

      // High Mid: Individual scattered spikes, highly dependent on column random
      float highMidRegion = smoothstep(10.0, 45.0, centerDist);
      float highMidLift = 0.0;
      if (fract(rnd * 13.3) > 0.8) {
          highMidLift = uHighMid * highMidRegion * fract(rnd * 7.7) * 2.5; // Reduced from 4.0
      }

      // Combine
      float audioElevation = subLift + bassLift + lowMidLift + midLift + highMidLift;

      // Energy Spike
      if (rnd > 0.99) {
          audioElevation += uEnergy * 5.0; // Reduced from 10.0
      }
      
      audioElevation *= globalFalloff;
      
      float elevation = idleElevation + audioElevation;
      
      // Ripples
      float rippleElevation = 0.0;
      float rippleIntensityNormal = 0.0;
      float rippleIntensityWhite = 0.0;
      float speed = 15.0;
      float width = 3.0;

      for(int i = 0; i < 10; i++) {
        if(uRipples[i].isActive > 0.0) {
           float dist = length(pos2D - uRipples[i].pos);
           float timeSince = uTime - uRipples[i].time;
           
           float curSpeed = speed;
           float curWidth = width;
           float curFadeDist = 15.0;
           float elevationScale = 4.0;
           
           if (uRipples[i].rippleType > 0.5) {
               curSpeed = 20.0;
               curWidth = 1.0; // Sharper
               curFadeDist = 8.0; // Fades out faster
               elevationScale = 1.0; // Less elevation impact
           }
           
           float waveRadius = timeSince * curSpeed;
           float d = dist - waveRadius;
           float rippleWave = exp(-d*d / curWidth);
           float fade = exp(-waveRadius / curFadeDist);
           float rPulse = rippleWave * fade * uRipples[i].strength;
           
           rippleElevation += rPulse * elevationScale;
           if (uRipples[i].rippleType > 0.5) {
               rippleIntensityWhite += rPulse;
           } else {
               rippleIntensityNormal += rPulse;
           }
        }
      }
      
      elevation += rippleElevation;
      vRippleAnim = vec2(clamp(rippleIntensityNormal, 0.0, 1.0), clamp(rippleIntensityWhite, 0.0, 1.0));
      vElevation = elevation;

      float yPos = position.y + 0.5; // 0 to 1
      vRelativeY = yPos;
      
      float totalHeight = 1.0 + elevation;
      vec3 pos = position;
      pos.y = -0.5 + yPos * totalHeight; // Anchor bottom to local -0.5
      
      vec4 worldPosition = instanceMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // fragment shader
  `
    uniform float uTime;
    
    // High frequency & timbral uniforms for color
    uniform float uPresence;
    uniform float uBrilliance;
    uniform float uAir;
    
    uniform float uWarmth;
    uniform float uBrightness;
    uniform float uSharpness;
    
    // Theme Uniforms
    uniform vec3 uBaseColor1;
    uniform vec3 uBaseColor2;
    uniform vec3 uCoolCore;
    uniform vec3 uCoolEdge;
    uniform vec3 uWarmCore;
    uniform vec3 uWarmEdge;
    uniform vec3 uRippleColor;
    uniform float uGlowIntensity;

    varying vec2 vUv;
    varying float vElevation;
    varying float vDistance;
    varying vec2 vRippleAnim;
    varying vec3 vNormal;
    varying float vRelativeY;
    varying vec2 vInstancePos;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      bool isTop = vNormal.y > 0.5;
      float distFromTop = 1.0 - vRelativeY;
      
      float rnd = random(vInstancePos);
      float centerDist = length(vInstancePos);
      
      float normElevation = clamp(vElevation / 8.0, 0.0, 1.0);
      
      // Base dark pillars
      vec3 cBase1 = uBaseColor1;
      vec3 cBase2 = uBaseColor2;
      
      // Timbre determines palette
      // Warmth drives red/orange, Brightness drives blue/cyan, Sharpness adds stark white clipping
      vec3 coolCore = uCoolCore;
      vec3 coolEdge = uCoolEdge;
      
      vec3 warmCore = uWarmCore;
      vec3 warmEdge = uWarmEdge;
      
      float warmBlend = smoothstep(0.0, 1.0, uWarmth * 1.5 + (0.5 - centerDist/80.0));
      
      vec3 zoneCore = mix(coolCore, warmCore, warmBlend);
      vec3 zoneEdge = mix(coolEdge, warmEdge, warmBlend);
      
      // Shift colors slightly per pillar
      vec3 targetGlow = mix(zoneCore, zoneEdge, fract(rnd * 11.0));
      
      // Distance fade for contrast and brightness
      float distFade = 1.0 - smoothstep(40.0, 75.0, centerDist);
      
      // Brightness lifts the black point of the glow, adding cyan/white wash
      targetGlow = mix(targetGlow, vec3(0.4, 0.8, 1.0), uBrightness * 0.6);
      
      vec3 currentGlow = mix(cBase2, targetGlow, normElevation) * uGlowIntensity * distFade;
      
      // Ripple overrides
      currentGlow = mix(currentGlow, uRippleColor, vRippleAnim.x);
      currentGlow = mix(currentGlow, vec3(1.0, 1.0, 1.0), vRippleAnim.y);
      
      vec3 bodyColor = mix(cBase1, cBase2, vRelativeY * distFade);
      vec3 finalColor;

      if (isTop) {
         float topIntensity = smoothstep(0.0, 0.4, normElevation);
         
         // Distance falloff for twinkling on flat ground
         float twinkleDistFalloff = smoothstep(60.0, 30.0, centerDist);
         float twinkleMultiplier = mix(twinkleDistFalloff, 1.0, smoothstep(0.01, 0.1, normElevation));

         // Inactive shimmering (Air / Brilliance)
         bool isSparkleTarget = fract(rnd * 31.0) > 0.95;
         if (isSparkleTarget && normElevation < 0.1) {
            topIntensity += uAir * 2.0 * twinkleMultiplier;
         }
         
         finalColor = mix(cBase2, currentGlow, topIntensity);
         
         // Edges glow on the top face
         float edgeX = smoothstep(0.05, 0.01, vUv.x) + smoothstep(0.95, 0.99, vUv.x);
         float edgeY = smoothstep(0.05, 0.01, vUv.y) + smoothstep(0.95, 0.99, vUv.y);
         float edge = min(edgeX + edgeY, 1.0);
         finalColor += currentGlow * edge * 0.8 * (topIntensity + 0.3);
         
         // Presence / Sharpness flickers
         float flashChance = smoothstep(0.3, 1.0, uPresence);
         if (fract(rnd * 53.0) > 0.98 - flashChance * 0.1) {
             float flashSync = sin(uTime * 40.0 + rnd * 100.0) * 0.5 + 0.5;
             finalColor += mix(vec3(1.0), vec3(0.5, 1.0, 1.0), rnd) * flashSync * uPresence * (1.0 + uSharpness * 2.0) * twinkleMultiplier;
         }
         
         // Brilliance micro-sparks strictly on edges
         if (edge > 0.5 && fract(rnd * 89.0 + uTime * 2.0) > 0.98) {
             finalColor += vec3(1.0) * uBrilliance * 3.0 * twinkleMultiplier;
         }

      } else {
         // Side faces
         // Smooth music has longer vertical glow, sharp music restricts it tightly to top
         float verticalFalloff = mix(1.0, 3.0, uSharpness);
         float sideGlow = smoothstep(0.5 / verticalFalloff, 0.0, distFromTop) * normElevation;
         
         if (normElevation < 0.02) sideGlow = 0.0;
         
         finalColor = mix(bodyColor, currentGlow, sideGlow * 1.5);
         
         // Top Rim
         float rimGlow = smoothstep(0.03, 0.0, distFromTop) * normElevation;
         finalColor += currentGlow * rimGlow;
      }
      
      finalColor += uRippleColor * vRippleAnim.x * 0.6;
      finalColor += vec3(1.0, 1.0, 1.0) * vRippleAnim.y * 1.2;
      
      // Aerial Perspective / Fog
      float aerialFog = smoothstep(30.0, 65.0, vDistance);
      vec3 atmosphericColor = mix(cBase1, cBase2, 0.4);
      finalColor = mix(finalColor, atmosphericColor, aerialFog * 0.5);
      
      // Distance fade out to transparent
      float alphaFade = 1.0 - smoothstep(55.0, 78.0, vDistance);
      
      gl_FragColor = vec4(finalColor, alphaFade);
    }
  `,
);
