import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Wind, Coffee, Music, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

export default function SanctuaryCustomizer() {
  const [steamDensity, setSteamDensity] = useState(65);
  const [windRustle, setWindRustle] = useState(30);
  const [jazzTempo, setJazzTempo] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio node references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamOscRef = useRef<OscillatorNode | null>(null);
  const windNoiseRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const windGainRef = useRef<GainNode | null>(null);
  const steamGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Cleanup audio on component unmount
    return () => {
      stopSynthesizer();
    };
  }, []);

  // Update visual parameters in real-time
  useEffect(() => {
    if (isPlaying) {
      if (steamGainRef.current) {
        // Map steam density to soft low oscillator frequency amplitude
        steamGainRef.current.gain.setValueAtTime((steamDensity / 100) * 0.08, audioCtxRef.current?.currentTime || 0);
      }
      if (windGainRef.current) {
        // Map wind rustle to white noise volume
        windGainRef.current.gain.setValueAtTime((windRustle / 100) * 0.05, audioCtxRef.current?.currentTime || 0);
      }
    }
  }, [steamDensity, windRustle, isPlaying]);

  const startSynthesizer = () => {
    try {
      // 1. Create native fallback audio context
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 2. Setup master dynamic volume safety filter
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime); // Safe global ceiling
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 3. Steam Synthesizer (Warm low-frequency harmonic resonance)
      const steamOsc = ctx.createOscillator();
      const steamFilter = ctx.createBiquadFilter();
      const steamGain = ctx.createGain();

      steamOsc.type = 'sine';
      steamOsc.frequency.setValueAtTime(82.41, ctx.currentTime); // Deep warm E2 note
      steamFilter.type = 'lowpass';
      steamFilter.frequency.setValueAtTime(150, ctx.currentTime);

      steamGain.gain.setValueAtTime((steamDensity / 100) * 0.08, ctx.currentTime);

      steamOsc.connect(steamFilter);
      steamFilter.connect(steamGain);
      steamGain.connect(masterGain);
      
      steamOsc.start();
      streamOscRef.current = steamOsc;
      steamGainRef.current = steamGain;

      // 4. Glasshouse Wind Rustle (Simulated pink-white noise generator)
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      // Simple brown/pink noise algorithm for soothing breeze
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Low pass filtering random distribution
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(220, ctx.currentTime);
      windFilter.Q.setValueAtTime(1.5, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime((windRustle / 100) * 0.06, ctx.currentTime);

      noiseNode.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);

      noiseNode.start();
      windNoiseRef.current = noiseNode as any;
      windGainRef.current = windGain;

      setIsPlaying(true);
    } catch (e) {
      console.warn("Web Audio restrictions prevented instant startup. Interaction required first.", e);
    }
  };

  const stopSynthesizer = () => {
    try {
      if (streamOscRef.current) {
        streamOscRef.current.stop();
        streamOscRef.current.disconnect();
      }
      if (windNoiseRef.current) {
        (windNoiseRef.current as any).disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    } catch (e) {
      // Ignored during standard teardown
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSynthesizer();
    } else {
      startSynthesizer();
    }
  };

  // Aesthetic vibe calculation labels
  const getAtmosphereTitle = () => {
    const total = steamDensity + windRustle + jazzTempo;
    if (total > 200) return "Symphonically Robust & Dynamic";
    if (total > 130) return "Warm Botanical Sanctuary";
    return "Ultra-Minimalist Zen Glasshouse";
  };

  return (
    <GlassCard theme="light" id="sanctuary-ambient-mixer" className="w-full max-w-lg mx-auto !p-6 border border-[#C4A484]/20 transition-all shadow-xl" hoverEffect={false}>
      
      {/* Widget Header */}
      <div className="flex justify-between items-center pb-4 mb-5 border-b border-cafe-smoky/5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-cafe-smoky/5 border border-cafe-gold/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cafe-gold animate-spin [animation-duration:10s]" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wide text-cafe-charcoal">
              Ambient Sanctuary Synth
            </h4>
            <span className="text-[9px] uppercase tracking-wider font-mono text-cafe-bronze font-bold block mt-0.5">
              Atmosphere: {getAtmosphereTitle()}
            </span>
          </div>
        </div>

        {/* Dynamic audio activation button */}
        <button
          onClick={toggleSound}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all text-[9px] font-mono font-bold tracking-widest uppercase cursor-pointer ${
            isPlaying 
              ? 'bg-amber-400/10 border-amber-400 text-amber-500 shadow-md animate-pulse'
              : 'bg-cafe-smoky/5 border-cafe-smoky/10 text-cafe-smoky hover:bg-cafe-smoky hover:text-white'
          }`}
          title={isPlaying ? "Mute ambient audio synthesizer" : "Unmute ambient audio synthesizer"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3 h-3 text-amber-500" />
              <span>Synthesizer Active</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 text-cafe-smoky" />
              <span>Listen Live Synth</span>
            </>
          )}
        </button>
      </div>

      {/* Control sliders stack */}
      <div className="space-y-4">
        
        {/* Steam Density Aroma Dial */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-cafe-charcoal/60">
            <span className="flex items-center space-x-1">
              <Coffee className="w-3.5 h-3.5 text-cafe-gold" />
              <span>Espresso Steam Density</span>
            </span>
            <span className="font-bold text-cafe-smoky">{steamDensity}%</span>
          </div>
          <div className="relative group/slider pt-1">
            <input
              type="range"
              min="10"
              max="100"
              value={steamDensity}
              onChange={(e) => setSteamDensity(Number(e.target.value))}
              className="w-full h-[3px] bg-cafe-smoky/10 rounded-full appearance-none cursor-pointer accent-cafe-gold"
            />
          </div>
        </div>

        {/* Botanical Wind Breeze Rustle */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-cafe-charcoal/60">
            <span className="flex items-center space-x-1">
              <Wind className="w-3.5 h-3.5 text-cafe-gold" />
              <span>Glasshouse Breeze</span>
            </span>
            <span className="font-bold text-cafe-smoky">{windRustle}%</span>
          </div>
          <div className="relative group/slider pt-1">
            <input
              type="range"
              min="0"
              max="100"
              value={windRustle}
              onChange={(e) => setWindRustle(Number(e.target.value))}
              className="w-full h-[3px] bg-cafe-smoky/10 rounded-full appearance-none cursor-pointer accent-cafe-gold"
            />
          </div>
        </div>

        {/* Soft Jazz Lounge Resonance scale */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-cafe-charcoal/60">
            <span className="flex items-center space-x-1">
              <Music className="w-3.5 h-3.5 text-cafe-gold" />
              <span>Classical Jazz Cadence</span>
            </span>
            <span className="font-bold text-cafe-smoky">{jazzTempo > 70 ? 'Fast' : jazzTempo > 35 ? 'Largo/Andante' : 'Adagio'}</span>
          </div>
          <div className="relative group/slider pt-1">
            <input
              type="range"
              min="10"
              max="100"
              value={jazzTempo}
              onChange={(e) => setJazzTempo(Number(e.target.value))}
              className="w-full h-[3px] bg-cafe-smoky/10 rounded-full appearance-none cursor-pointer accent-cafe-gold"
            />
          </div>
        </div>

      </div>

      {/* Dynamic textual feedback detailing vibe recipes */}
      <div className="mt-5 p-3.5 rounded-xl bg-cafe-smoky/5 border border-cafe-smoky/5 text-[10px] font-sans leading-relaxed text-cafe-charcoal/60 select-none">
        🌿 <strong>VIBE RECIPE SPECS</strong>: Setting steam level to <strong>{steamDensity}%</strong> paired with a <strong>{windRustle}%</strong> fresh garden breeze generates a private boutique {steamDensity > 75 ? 'roasted high-elevation' : 'velvety-creamy'} aromatic scent signature inside Cafe Vista.
      </div>

    </GlassCard>
  );
}
