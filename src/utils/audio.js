// MUSEORA Web Audio API Ambient Synthesizer & Sound Effects

class MuseumAudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.isEnabled = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.initContext();
    this.isEnabled = !this.isEnabled;

    if (this.isEnabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.isEnabled;
  }

  startAmbient() {
    if (!this.ctx || !this.isEnabled) return;
    try {
      if (this.droneOsc1) this.stopAmbient();

      // Ambient gain node
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 3.0);

      // Low warm drone oscillators (Deep warm 55Hz & 110Hz harmonics)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();

      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // Subtle binaural detune

      // Filter for warm dark museum atmosphere
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        if (this.droneOsc1) {
          try {
            this.droneOsc1.stop();
            this.droneOsc2.stop();
          } catch (e) {}
          this.droneOsc1 = null;
          this.droneOsc2 = null;
        }
      }, 500);
    }
  }

  playHoverSound() {
    if (!this.ctx || !this.isEnabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.008, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playClickSound() {
    if (!this.ctx || !this.isEnabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(261.63, this.ctx.currentTime + 0.15); // C4

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }
  playSpatialSound(direction = 'center') {
    if (!this.ctx || !this.isEnabled) return;
    try {
      this.initContext();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();
      
      // Direction maps to stereo pan: left=-1, right=1, center=0
      const panValues = { left: -0.8, right: 0.8, center: 0, 'far-left': -1, 'far-right': 1 };
      panner.pan.setValueAtTime(panValues[direction] || 0, this.ctx.currentTime);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      
      osc.connect(panner);
      panner.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  setAmbientMode(mode = 'default') {
    if (!this.ctx || !this.isEnabled) return;
    
    const modes = {
      default: { freq1: 55, freq2: 110.5, filterFreq: 180 },
      classical: { freq1: 65.41, freq2: 130.81, filterFreq: 200 },  // C2/C3 - warm resonant
      ancient: { freq1: 49, freq2: 98, filterFreq: 150 },  // Deep mystical
      renaissance: { freq1: 73.42, freq2: 146.83, filterFreq: 220 },  // D2/D3 - rich
      impressionist: { freq1: 82.41, freq2: 164.81, filterFreq: 250 },  // E2/E3 - bright
      digital: { freq1: 41.2, freq2: 123.47, filterFreq: 300 },  // Low synth - futuristic
    };
    
    const config = modes[mode] || modes.default;
    
    if (this.droneOsc1 && this.droneOsc2) {
      this.droneOsc1.frequency.exponentialRampToValueAtTime(config.freq1, this.ctx.currentTime + 1.0);
      this.droneOsc2.frequency.exponentialRampToValueAtTime(config.freq2, this.ctx.currentTime + 1.0);
    }
  }
}

export const museumAudio = new MuseumAudioEngine();
