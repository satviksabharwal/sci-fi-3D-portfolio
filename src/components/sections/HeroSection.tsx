"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useInView } from "react-intersection-observer";
import { useLocale, useTranslations } from "next-intl";
import { PERSONAL } from "@/lib/data";
import introClips from "@/lib/intro-clips.json";

const JourneyScene = dynamic(
  () => import("@/components/3d/JourneyScene").then((m) => m.JourneyScene),
  { ssr: false },
);

// Transform-only entrance for the name, role and bio: they are the LCP
// candidates, so they must be painted in the server HTML (no opacity: 0).
const slideUp = (delay = 0) => ({
  initial: { y: 24 },
  animate: { y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
});

const STATS = [
  { value: "6+", labelKey: "stats.years" },
  { value: "20+", labelKey: "stats.projects" },
  { value: "5", labelKey: "stats.companies" },
  { value: "2", labelKey: "stats.degrees" },
] as const;

export function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const roles = t.raw("roles") as string[];
  const sequence = roles.flatMap((role) => [role, 2000]);
  const [firstName, ...restName] = PERSONAL.name.split(" ");

  // ── Live intro state ──────────────────────────────────────
  // The 3D scene is the heaviest thing on the page, so it mounts only once
  // the page has loaded and the main thread is idle.
  const [mountScene, setMountScene] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [caption, setCaption] = useState("");
  const [fullLine, setFullLine] = useState("");
  const [sound, setSound] = useState(false);
  const [faceVideo, setFaceVideo] = useState<HTMLVideoElement | null>(null);
  const [run, setRun] = useState(0);
  const introducedRef = useRef(false);
  const autoFlownRef = useRef(false);
  const [introduced, setIntroduced] = useState(false);
  // Watch the scene itself, not the whole hero: on phones the hero is taller
  // than the screen and the astronaut sits below the text.
  const { ref: sceneRef, inView } = useInView({ threshold: 0.6 });

  useEffect(() => {
    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setMountScene(true), {
          timeout: 2500,
        });
      } else {
        timeoutId = setTimeout(() => setMountScene(true), 1200);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId) window.cancelIdleCallback(idleId);
      clearTimeout(timeoutId);
    };
  }, []);

  // He notices the visitor after a short beat on the hero, and goes back to
  // work the moment they scroll on.
  useEffect(() => {
    if (!inView || !sceneReady) {
      setGreeting(false);
      return;
    }
    const id = setTimeout(
      () => setGreeting(true),
      introducedRef.current ? 600 : 1500,
    );
    return () => clearTimeout(id);
  }, [inView, sceneReady]);

  // Plays the intro, one line at a time, as typed captions plus the best
  // media available for that line in public/intro/<locale>/:
  //   1. <key>.mp4 — an avatar video of Satvik saying it (pnpm generate:intro).
  //      It is shown inside the astronaut's helmet; muted unless sound is on.
  //   2. <key>.mp3 — his own voice recording, when sound is on.
  //   3. the browser's speech voice, when sound is on.
  // Keys are line-1 … line-N and again.
  useEffect(() => {
    if (!greeting) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)));
    const canSpeak = sound && "speechSynthesis" in window;
    let playing: HTMLMediaElement | null = null;

    const videoKeys = (introClips as Record<string, string[]>)[locale] ?? [];

    const loadMedia = <T extends HTMLMediaElement>(el: T, src: string) =>
      new Promise<T | null>((resolve) => {
        el.preload = "auto";
        // loadedmetadata, not loadeddata: iPhones don't decode any frames
        // until playback starts, so loadeddata would never arrive there.
        el.onloadedmetadata = () => resolve(el);
        el.onerror = () => resolve(null);
        timers.push(setTimeout(() => resolve(null), 4000));
        el.src = src;
        el.load();
      });

    const loadClip = async (key: string) => {
      // The manifest lists the rendered videos, so missing ones cost no request.
      if (videoKeys.includes(key)) {
        const video = document.createElement("video");
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.muted = !sound;
        const loaded = await loadMedia(video, `/intro/${locale}/${key}.mp4`);
        if (loaded) return loaded;
      }
      return sound ? loadMedia(new Audio(), `/intro/${locale}/${key}.mp3`) : null;
    };

    const playClip = (audio: HTMLMediaElement) =>
      new Promise<void>((resolve) => {
        playing = audio;
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
        audio.play().catch(() => {
          // Phones refuse sound that doesn't start from a tap. Play the clip
          // silently so his lips still move with the captions.
          audio.muted = true;
          audio.play().catch(() => resolve());
        });
      });

    const speak = (line: string) =>
      new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.lang = locale === "de" ? "de-DE" : "en-US";
        utterance.rate = 1.02;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        // Some browsers never fire onend — don't let the intro hang.
        timers.push(setTimeout(resolve, line.length * 95 + 2500));
        window.speechSynthesis.speak(utterance);
      });

    const type = async (line: string, step: number) => {
      for (let i = 1; i <= line.length; i++) {
        if (cancelled) return;
        setCaption(line.slice(0, i));
        await sleep(step);
      }
    };

    (async () => {
      const again = introducedRef.current;
      const lines = again
        ? [t("intro.again")]
        : (t.raw("intro.lines") as string[]);
      // Fetch every clip up front, while the chair turns and the visor lifts,
      // so there is no loading pause between lines.
      const clips = lines.map((_, i) => loadClip(again ? "again" : `line-${i + 1}`));
      await sleep(1250);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (cancelled) return;
        const clip = await clips[i];
        if (cancelled) return;
        // The scene cross-fades from his resting face to this clip and back.
        if (clip instanceof HTMLVideoElement) setFaceVideo(clip);
        // With a recording, the caption types at the pace of the voice.
        const step =
          clip && Number.isFinite(clip.duration)
            ? Math.min(Math.max((clip.duration * 1000) / line.length, 18), 140)
            : canSpeak
              ? 52
              : 26;
        setFullLine(line);
        setSpeaking(true);
        await Promise.all([
          type(line, step),
          clip ? playClip(clip) : canSpeak ? speak(line) : null,
        ]);
        if (cancelled) return;
        setSpeaking(false);
        await sleep(clip instanceof HTMLVideoElement ? 450 : 1100);
      }
      introducedRef.current = true;
      setIntroduced(true);
      // Intro done: after a beat he closes the visor. The first time, the page
      // then glides down far enough that he lifts off and is flying — he just
      // said "fly with me", so he does. Only once per visit, only if the
      // visitor hasn't scrolled themselves, and never under reduced motion;
      // otherwise (and on every later intro) he turns back to his code.
      await sleep(1100);
      if (cancelled) return;
      setGreeting(false);
      const about = document.getElementById("about");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!autoFlownRef.current && about && !reducedMotion && window.scrollY < 40) {
        autoFlownRef.current = true;
        // 0.62 of the way to the next section is where the flight pose is complete
        window.scrollTo({ top: about.offsetTop * 0.62, behavior: "smooth" });
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      playing?.pause();
      setFaceVideo(null);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setSpeaking(false);
      setCaption("");
      setFullLine("");
    };
  }, [greeting, sound, run, locale, t]);

  const replay = useCallback(() => {
    introducedRef.current = false;
    setRun((n) => n + 1);
    setGreeting(true); // he may already be back at work
  }, []);

  const toggleSound = useCallback(() => {
    introducedRef.current = false;
    // Turning sound on plays the intro again, this time with his voice.
    if (!sound) setGreeting(true);
    setSound(!sound);
  }, [sound]);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center pt-24 lg:pt-28 pb-10 lg:pb-20 px-6"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
        {/* LEFT — Text */}
        <div>
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2.5 mb-5 lg:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
            </span>
            <span className="text-[11px] tracking-[0.22em] text-white/60 uppercase font-mono">
              {t("available")}
            </span>
          </motion.div>

          <motion.div {...slideUp(0.1)}>
            <h1 className="font-display leading-[1.02] tracking-tight mb-5">
              <span className="block text-white/40 text-sm mb-4 font-mono tracking-[0.22em] uppercase">
                {t("greeting")}
              </span>
              <span className="block text-5xl md:text-6xl xl:text-7xl text-white">
                <span className="font-bold">{firstName}</span>{" "}
                <span className="font-light">{restName.join(" ")}</span>
              </span>
            </h1>
          </motion.div>

          <motion.div {...slideUp(0.2)} className="min-h-[3.5rem] flex items-center mb-6 lg:mb-9">
            <span className="text-xl md:text-2xl text-accent-cyan font-display font-light tracking-tight">
              <span className="text-accent-cyan/60">/</span>
              <TypeAnimation
                sequence={sequence}
                wrapper="span"
                preRenderFirstString
                speed={50}
                repeat={Infinity}
              />
            </span>
          </motion.div>


          <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-2.5 sm:gap-3 mb-6 lg:mb-14">
            <a
              href="#about"
              className="px-4 sm:px-6 py-3 rounded-full bg-accent-cyan text-bg-primary font-body font-medium text-[13px] sm:text-sm whitespace-nowrap hover:brightness-110 transition-all duration-200"
            >
              {t("cta.viewWork")} ↓
            </a>
            <a
              href="#contact"
              className="px-4 sm:px-6 py-3 rounded-full border border-accent-cyan/50 text-white text-[13px] sm:text-sm whitespace-nowrap hover:bg-accent-cyan/10 transition-all duration-200"
            >
              {t("cta.getInTouch")}
            </a>
          </motion.div>

          <motion.dl {...fadeUp(0.5)} className="hidden lg:flex flex-wrap gap-x-10 gap-y-4">
            {STATS.map((s) => (
              <div key={s.labelKey}>
                <dd className="font-display font-light text-3xl text-white">
                  {s.value}
                </dd>
                <dt className="text-white/40 text-[11px] font-mono tracking-wider uppercase mt-1">
                  {t(s.labelKey)}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* RIGHT — Live intro */}
        <div
          ref={sceneRef}
          className="relative h-[46svh] lg:h-[620px]"
        >
          {sceneFailed ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/satvik-avatar.jpg"
                alt={PERSONAL.name}
                width={260}
                height={260}
                className="rounded-full border border-white/10"
              />
            </div>
          ) : (
            <>
              {mountScene && (
                <div
                  className="transition-opacity duration-1000"
                  style={{ opacity: sceneReady ? 1 : 0 }}
                >
                  <JourneyScene
                    greeting={greeting}
                    speaking={speaking}
                    faceVideo={faceVideo}
                    onReady={() => setSceneReady(true)}
                    onError={() => setSceneFailed(true)}
                  />
                </div>
              )}
              {!sceneReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-accent-cyan/30 border-t-accent-cyan animate-spin" />
                </div>
              )}
            </>
          )}

          {/* Speech bubble */}
          <AnimatePresence>
            {caption && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="fixed z-30 bottom-5 left-4 right-24 lg:absolute lg:z-auto lg:bottom-auto lg:top-2 lg:left-4 lg:right-auto lg:max-w-[19rem] rounded-2xl rounded-bl-sm border border-accent-cyan/30 bg-bg-secondary/90 backdrop-blur-md px-4 py-3 text-sm lg:text-[15px] leading-snug text-white/90"
                aria-hidden="true"
              >
                {caption}
                {speaking && (
                  <span className="inline-block w-[2px] h-4 bg-accent-cyan ml-0.5 align-middle animate-pulse" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="sr-only" aria-live="polite">
            {fullLine}
          </p>

          {/* Status + controls */}
          {sceneReady && (
            <div className="absolute top-0 lg:top-auto lg:bottom-0 inset-x-0 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:pr-[4.5rem] 2xl:pr-0">
              {/* Phones: directly under the hero buttons, above the scene, so
                  neither the caption bar nor the chat button can cover it.
                  Desktop: along the bottom of the scene, kept left of the chat
                  button until the screen is wide enough to clear it. */}
              <span className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    greeting ? "bg-accent-cyan animate-pulse" : "bg-white/30"
                  }`}
                />
                {greeting ? t("intro.statusLive") : t("intro.statusCoding")}
              </span>
              <span className="flex items-center gap-2">
                {(greeting || introduced) && (
                  <button
                    type="button"
                    onClick={replay}
                    className="px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-white/60 hover:text-white hover:border-white/30 transition-colors"
                  >
                    {t("intro.replay")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={sound}
                  className={`px-3 py-1.5 rounded-full border text-[11px] transition-colors ${
                    sound
                      ? "border-accent-cyan/60 text-accent-cyan"
                      : "border-white/10 text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  {sound ? t("intro.soundOn") : t("intro.soundOff")}
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase font-mono">
          {t("scroll")}
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-accent-cyan/60 to-transparent" />
      </motion.div>
    </section>
  );
}

