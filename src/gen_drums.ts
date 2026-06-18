import fs from 'fs';

const sampleRate = 44100;
const bpm = 120;
const beatDuration = 60 / bpm; // 0.5s per beat
const numBeats = 16; // 8 seconds
const numSamples = Math.floor(sampleRate * beatDuration * numBeats);

const buffers = new Float32Array(numSamples);

for (let i = 0; i < numBeats; i++) {
  const isKick = i % 2 === 0;
  const isSnare = i % 2 === 1;
  const startIndex = Math.floor(i * beatDuration * sampleRate);

  if (isKick) {
    for (let j = 0; j < sampleRate * 0.4; j++) {
      if (startIndex + j >= numSamples) break;
      const t = j / sampleRate;
      const freq = 150 * Math.exp(-t * 20); // Pitch drop
      const phase = 2 * Math.PI * freq * t; // Simplified phase
      const env = Math.exp(-t * 10);
      buffers[startIndex + j] += Math.sin(phase) * env * 0.9;
    }
  }

  if (isSnare) {
    for (let j = 0; j < sampleRate * 0.3; j++) {
      if (startIndex + j >= numSamples) break;
      const t = j / sampleRate;
      const noise = (Math.random() * 2 - 1);
      const env = Math.exp(-t * 15);
      const toneFreq = 200;
      const tone = Math.sin(2 * Math.PI * toneFreq * t) * Math.exp(-t * 10);
      buffers[startIndex + j] += (noise * 0.7 + tone * 0.3) * env * 0.9;
    }
  }
}

const wavBuffer = Buffer.alloc(44 + numSamples * 2);

// RIFF
wavBuffer.write('RIFF', 0);
wavBuffer.writeUInt32LE(36 + numSamples * 2, 4);
wavBuffer.write('WAVE', 8);

// fmt 
wavBuffer.write('fmt ', 12);
wavBuffer.writeUInt32LE(16, 16);
wavBuffer.writeUInt16LE(1, 20);
wavBuffer.writeUInt16LE(1, 22);
wavBuffer.writeUInt32LE(sampleRate, 24);
wavBuffer.writeUInt32LE(sampleRate * 2, 28);
wavBuffer.writeUInt16LE(2, 32);
wavBuffer.writeUInt16LE(16, 34);

// data
wavBuffer.write('data', 36);
wavBuffer.writeUInt32LE(numSamples * 2, 40);

for (let i = 0; i < numSamples; i++) {
  let sample = Math.max(-1, Math.min(1, buffers[i]));
  wavBuffer.writeInt16LE(sample < 0 ? sample * 0x8000 : sample * 0x7FFF, 44 + i * 2);
}

fs.writeFileSync('public/drum_loop.wav', wavBuffer);
console.log('Done');
