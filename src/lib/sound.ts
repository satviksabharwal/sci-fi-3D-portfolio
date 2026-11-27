"use client";

import { useSyncExternalStore } from "react";

/**
 * The site's sound, synthesised live with the Web Audio API — no audio files.
 *
 *  - a slow ambient pad that drifts through four chords
 *  - a soft rush of thrust that follows how fast the page is scrolling
 *  - a two-note chime on arriving at a new section
 *
 * One switch controls all of it and the astronaut's spoken intro. Browsers
 * only allow audio to start from a click or tap, so it is off until the
 * visitor turns it on; `setSoundOn(true)` must be called from such a handler.
 */

// Story order of the page — the same list as MissionHud's STATIONS.
const STATIONS = ["hero", "about", "experience", "skills", "projects", "contact"];

// Four chords, each as [bass, fifth, octave, colour, air] in Hz.
const CHORDS = [
  [55.0, 82.41, 110.0, 261.63, 329.63], // A minor
  [43.65, 65.41, 87.31, 261.63, 349.23], // F major
  [65.41, 98.0, 130.81, 329.63, 392.0], // C major
  [49.0, 73.42, 98.0, 293.66, 392.0], // G major
];
const VOICE_GAINS = [0.2, 0.13, 0.1, 0.035, 0.022];
const CHORD_SECONDS = 18;
const MASTER_LEVEL = 0.55;

let on = false;
const listeners = new Set<() => void>();

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let padBus: GainNode | null = null;
let thrustGain: GainNode | null = null;
let thrustFilter: BiquadFilterNode | null = null;
let wet: GainNode | null = null;
let voices: OscillatorNode[] = [];
let chordIndex = 0;
let chordTimer: ReturnType<typeof setInterval> | undefined;
let rafId = 0;
let lastScroll = 0;
let lastTime = 0;
let speed = 0;
let station = -1;

function build() {
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return false;
  ctx = new AudioCtor();

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // A cheap room: two feedback delays behind a low-pass, so notes trail off.
  wet = ctx.createGain();
  wet.gain.value = 0.5;
  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 1800;
  [0.31, 0.47].forEach((time) => {
    const delay = ctx!.createDelay(1);
    delay.delayTime.value = time;
    const feedback = ctx!.createGain();
    feedback.gain.value = 0.42;
    wet!.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(damp);
  });
  damp.connect(master);

  // Pad: five voices through one slowly breathing low-pass.
  padBus = ctx.createGain();
  padBus.gain.value = 1;
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 520;
  padFilter.Q.value = 0.6;
  const breath = ctx.createOscillator();
  breath.frequency.value = 0.045;
  const breathDepth = ctx.createGain();
  breathDepth.gain.value = 240;
  breath.connect(breathDepth);
  breathDepth.connect(padFilter.frequency);
  breath.start();
  padBus.connect(padFilter);
  padFilter.connect(master);
  padFilter.connect(wet);

  voices = CHORDS[0].map((freq, i) => {
    const osc = ctx!.createOscillator();
    osc.type = i < 2 ? "sine" : "triangle";
    osc.frequency.value = freq;
    osc.detune.value = (i % 2 ? 1 : -1) * 4; // slight detune keeps it alive
    const gain = ctx!.createGain();
    gain.gain.value = VOICE_GAINS[i];
    osc.connect(gain);
    gain.connect(padBus!);
    osc.start();
    return osc;
  });

  // Thrust: looping noise through a band-pass, silent until the page moves.
  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = noise;
  source.loop = true;
  thrustFilter = ctx.createBiquadFilter();
  thrustFilter.type = "bandpass";
  thrustFilter.frequency.value = 300;
  thrustFilter.Q.value = 0.8;
  thrustGain = ctx.createGain();
  thrustGain.gain.value = 0;
  source.connect(thrustFilter);
  thrustFilter.connect(thrustGain);
  thrustGain.connect(master);
  source.start();
  return true;
}

function nextChord() {
  if (!ctx) return;
  chordIndex = (chordIndex + 1) % CHORDS.length;
  const now = ctx.currentTime;
  voices.forEach((osc, i) => {
    osc.frequency.cancelScheduledValues(now);
    osc.frequency.setValueAtTime(osc.frequency.value, now);
    osc.frequency.linearRampToValueAtTime(CHORDS[chordIndex][i], now + 5);
  });
}

function chime() {
  if (!ctx || !master || !wet) return;
  const now = ctx.currentTime;
  [880, 1318.5].forEach((freq, i) => {
    const osc = ctx!.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx!.createGain();
    const start = now + i * 0.11;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);
    osc.connect(gain);
    gain.connect(master!);
    gain.connect(wet!);
    osc.start(start);
    osc.stop(start + 1.7);
  });
}

function currentStation() {
  const y = window.scrollY + window.innerHeight * 0.4;
  let index = 0;
  STATIONS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && y >= el.offsetTop) index = i;
  });
  return index;
}

function tick(time: number) {
  rafId = requestAnimationFrame(tick);
  if (!ctx || !thrustGain || !thrustFilter) return;
  const dt = Math.min((time - lastTime) / 1000, 0.1) || 0.016;
  lastTime = time;
  const y = window.scrollY;
  const velocity = Math.abs(y - lastScroll) / dt; // px per second
  lastScroll = y;
  speed += (Math.min(velocity / 2600, 1) - speed) * Math.min(1, dt * 5);
  const now = ctx.currentTime;
  thrustGain.gain.setTargetAtTime(speed * 0.16, now, 0.08);
  thrustFilter.frequency.setTargetAtTime(260 + speed * 900, now, 0.1);

  const index = currentStation();
  if (index !== station) {
    if (station !== -1) chime();
    station = index;
  }
}

function onVisibility() {
  if (!ctx || !on) return;
  if (document.hidden) void ctx.suspend();
  else void ctx.resume();
}

function start() {
  if (!ctx && !build()) return;
  void ctx!.resume();
  const now = ctx!.currentTime;
  master!.gain.cancelScheduledValues(now);
  master!.gain.setValueAtTime(master!.gain.value, now);
  master!.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 1.8);
  lastScroll = window.scrollY;
  lastTime = performance.now();
  station = -1;
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
  clearInterval(chordTimer);
  chordTimer = setInterval(nextChord, CHORD_SECONDS * 1000);
  document.addEventListener("visibilitychange", onVisibility);
}

function stop() {
  cancelAnimationFrame(rafId);
  clearInterval(chordTimer);
  document.removeEventListener("visibilitychange", onVisibility);
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 0.4);
  const context = ctx;
  setTimeout(() => {
    if (!on) void context.suspend();
  }, 500);
}

/** Turn all site sound on or off. Call from a click or tap handler. */
export function setSoundOn(next: boolean) {
  if (next === on) return;
  on = next;
  if (on) start();
  else stop();
  listeners.forEach((listener) => listener());
}

/** Lower the pad while the astronaut is speaking, so his voice is clear. */
export function duckAmbient(ducked: boolean) {
  if (!ctx || !padBus) return;
  padBus.gain.setTargetAtTime(ducked ? 0.3 : 1, ctx.currentTime, 0.25);
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Whether site sound is on. Shared by every component that shows the switch. */
export function useSoundOn() {
  return useSyncExternalStore(
    subscribe,
    () => on,
    () => false,
  );
}
