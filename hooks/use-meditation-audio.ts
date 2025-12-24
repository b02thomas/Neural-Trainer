'use client';

import { useCallback, useRef, useEffect } from 'react';
import { BrainwaveType, BRAINWAVE_CONFIGS } from '@/types/meditation';

interface UseMeditationAudioOptions {
  volume?: number;
  binauralVolume?: number;
}

// Frequencies for different sounds (in Hz)
const CHIME_FREQUENCIES = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)
const COMPLETE_FREQUENCIES = [392, 493.88, 587.33, 783.99]; // G4, B4, D5, G5 (ascending arpeggio)

// Binaural beat nodes
interface BinauralNodes {
  leftOsc: OscillatorNode;
  rightOsc: OscillatorNode;
  leftPanner: StereoPannerNode;
  rightPanner: StereoPannerNode;
  leftGain: GainNode;
  rightGain: GainNode;
}

export function useMeditationAudio(options: UseMeditationAudioOptions = {}) {
  const { volume = 0.3, binauralVolume = 0.15 } = options;
  const audioContextRef = useRef<AudioContext | null>(null);
  const binauralNodesRef = useRef<BinauralNodes | null>(null);
  const binauralVolumeRef = useRef(binauralVolume);

  // Initialize AudioContext on first interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Resume audio context if suspended (browser autoplay policy)
  const ensureAudioContextRunning = useCallback(async () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  }, [getAudioContext]);

  // Play a single tone with envelope
  const playTone = useCallback(async (
    frequency: number,
    duration: number,
    startTime: number,
    vol: number = volume
  ) => {
    const ctx = await ensureAudioContextRunning();

    // Create oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // Create gain node for envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.02); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Slow decay

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start and stop
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, [ensureAudioContextRunning, volume]);

  // Play a bell-like chime (for open monitoring intervals)
  const playChime = useCallback(async () => {
    const ctx = await ensureAudioContextRunning();
    const now = ctx.currentTime;

    // Play multiple frequencies for a richer bell sound
    for (let i = 0; i < CHIME_FREQUENCIES.length; i++) {
      const freq = CHIME_FREQUENCIES[i];
      const delay = i * 0.03; // Slight stagger for richness
      const duration = 2.5 - (i * 0.3); // Higher notes decay faster
      const vol = volume * (1 - i * 0.15); // Higher notes slightly quieter

      await playTone(freq, duration, now + delay, vol);
    }

    // Add a subtle high harmonic
    await playTone(1046.5, 1.5, now + 0.05, volume * 0.15); // C6
  }, [ensureAudioContextRunning, playTone, volume]);

  // Play completion sound (ascending arpeggio)
  const playComplete = useCallback(async () => {
    const ctx = await ensureAudioContextRunning();
    const now = ctx.currentTime;

    // Play ascending arpeggio
    for (let i = 0; i < COMPLETE_FREQUENCIES.length; i++) {
      const freq = COMPLETE_FREQUENCIES[i];
      const startTime = now + i * 0.15;
      const duration = 2.0 - (i * 0.2);
      const vol = volume * 0.8;

      await playTone(freq, duration, startTime, vol);
    }

    // Final chord at the end
    setTimeout(async () => {
      const ctx2 = await ensureAudioContextRunning();
      const chordTime = ctx2.currentTime;

      // Play a gentle major chord
      await playTone(392, 3, chordTime, volume * 0.4); // G4
      await playTone(493.88, 3, chordTime, volume * 0.35); // B4
      await playTone(587.33, 3, chordTime, volume * 0.3); // D5
    }, 600);
  }, [ensureAudioContextRunning, playTone, volume]);

  // Play a soft transition sound (for body scan region changes)
  const playTransition = useCallback(async () => {
    const ctx = await ensureAudioContextRunning();
    const now = ctx.currentTime;

    // Soft two-tone chime
    await playTone(440, 0.8, now, volume * 0.4); // A4
    await playTone(554.37, 0.6, now + 0.1, volume * 0.3); // C#5
  }, [ensureAudioContextRunning, playTone, volume]);

  // Start binaural beat with stereo panning
  // Left ear gets base frequency, right ear gets base + beat frequency
  const startBinauralBeat = useCallback(async (type: BrainwaveType) => {
    if (type === 'off') {
      return;
    }

    // Stop any existing binaural beat
    if (binauralNodesRef.current) {
      stopBinauralBeat();
    }

    const ctx = await ensureAudioContextRunning();
    const config = BRAINWAVE_CONFIGS[type];

    // Create oscillators
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';

    // Set frequencies: left ear base, right ear base + beat
    leftOsc.frequency.setValueAtTime(config.baseFrequency, ctx.currentTime);
    rightOsc.frequency.setValueAtTime(config.baseFrequency + config.beatFrequency, ctx.currentTime);

    // Create stereo panners
    const leftPanner = ctx.createStereoPanner();
    const rightPanner = ctx.createStereoPanner();
    leftPanner.pan.setValueAtTime(-1, ctx.currentTime); // Full left
    rightPanner.pan.setValueAtTime(1, ctx.currentTime); // Full right

    // Create gain nodes for volume control
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();

    // Fade in over 2 seconds
    leftGain.gain.setValueAtTime(0, ctx.currentTime);
    rightGain.gain.setValueAtTime(0, ctx.currentTime);
    leftGain.gain.linearRampToValueAtTime(binauralVolumeRef.current, ctx.currentTime + 2);
    rightGain.gain.linearRampToValueAtTime(binauralVolumeRef.current, ctx.currentTime + 2);

    // Connect nodes: oscillator -> panner -> gain -> destination
    leftOsc.connect(leftPanner);
    leftPanner.connect(leftGain);
    leftGain.connect(ctx.destination);

    rightOsc.connect(rightPanner);
    rightPanner.connect(rightGain);
    rightGain.connect(ctx.destination);

    // Start oscillators
    leftOsc.start();
    rightOsc.start();

    // Store references
    binauralNodesRef.current = {
      leftOsc,
      rightOsc,
      leftPanner,
      rightPanner,
      leftGain,
      rightGain,
    };
  }, [ensureAudioContextRunning]);

  // Stop binaural beat with fade out
  const stopBinauralBeat = useCallback(async () => {
    const nodes = binauralNodesRef.current;
    if (!nodes) return;

    const ctx = audioContextRef.current;
    if (!ctx) {
      // No context, just disconnect
      try {
        nodes.leftOsc.stop();
        nodes.rightOsc.stop();
      } catch {
        // Ignore if already stopped
      }
      binauralNodesRef.current = null;
      return;
    }

    // Fade out over 1 second
    const now = ctx.currentTime;
    nodes.leftGain.gain.linearRampToValueAtTime(0, now + 1);
    nodes.rightGain.gain.linearRampToValueAtTime(0, now + 1);

    // Stop oscillators after fade out
    setTimeout(() => {
      try {
        nodes.leftOsc.stop();
        nodes.rightOsc.stop();
      } catch {
        // Ignore if already stopped
      }
      binauralNodesRef.current = null;
    }, 1100);
  }, []);

  // Mute binaural beat (for pause)
  const muteBinauralBeat = useCallback(() => {
    const nodes = binauralNodesRef.current;
    const ctx = audioContextRef.current;
    if (!nodes || !ctx) return;

    // Fade to 0 over 0.1 seconds for smooth transition
    const now = ctx.currentTime;
    nodes.leftGain.gain.setTargetAtTime(0, now, 0.1);
    nodes.rightGain.gain.setTargetAtTime(0, now, 0.1);
  }, []);

  // Unmute binaural beat (for resume)
  const unmuteBinauralBeat = useCallback(() => {
    const nodes = binauralNodesRef.current;
    const ctx = audioContextRef.current;
    if (!nodes || !ctx) return;

    // Fade back to volume over 0.1 seconds
    const now = ctx.currentTime;
    nodes.leftGain.gain.setTargetAtTime(binauralVolumeRef.current, now, 0.1);
    nodes.rightGain.gain.setTargetAtTime(binauralVolumeRef.current, now, 0.1);
  }, []);

  // Set binaural beat volume
  const setBinauralVolume = useCallback((newVolume: number) => {
    binauralVolumeRef.current = newVolume;

    const nodes = binauralNodesRef.current;
    const ctx = audioContextRef.current;
    if (!nodes || !ctx) return;

    // Smoothly transition to new volume
    const now = ctx.currentTime;
    nodes.leftGain.gain.linearRampToValueAtTime(newVolume, now + 0.1);
    nodes.rightGain.gain.linearRampToValueAtTime(newVolume, now + 0.1);
  }, []);

  // Check if binaural is currently playing
  const isBinauralPlaying = useCallback(() => {
    return binauralNodesRef.current !== null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop binaural if playing
      if (binauralNodesRef.current) {
        try {
          binauralNodesRef.current.leftOsc.stop();
          binauralNodesRef.current.rightOsc.stop();
        } catch {
          // Ignore
        }
        binauralNodesRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Preload/warm up the audio context on mount
  const warmUp = useCallback(async () => {
    try {
      await ensureAudioContextRunning();
    } catch {
      // Ignore errors during warm-up
    }
  }, [ensureAudioContextRunning]);

  return {
    playChime,
    playComplete,
    playTransition,
    warmUp,
    startBinauralBeat,
    stopBinauralBeat,
    muteBinauralBeat,
    unmuteBinauralBeat,
    setBinauralVolume,
    isBinauralPlaying,
  };
}
