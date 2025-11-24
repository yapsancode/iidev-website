"use client"
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WaveCanvas } from '../ui/wave-canvas';
import { GradientText } from '../ui/GradientText';
import { Button } from '../ui/Button';

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    // 1. Use standard 'bg-background' so it swaps between white/black automatically.
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-background">

      {/* 2. Canvas: Ensure it sits behind content (z-0) */}
      <div className="absolute inset-0 z-0">
        <WaveCanvas className="opacity-60" />
      </div>

      {/* =============== NEW: GRID BACKGROUND START =============== */}
      {/* This div sits absolutely on top of the canvas but behind text (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* This inner div creates the grid using CSS gradients.
              1. It defines the grid size (bg-[size:...]').
              2. It defines the grid lines for Light Mode (gray lines).
              3. It defines the grid lines for Dark Mode (white lines).
          */}
        <div className="absolute h-full w-full 
              bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]
              bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)]
              dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        />
      </div>
      {/* =============== NEW: GRID BACKGROUND END =============== */}


      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pt-20">
        <motion.div
          style={{ y, opacity }}
          className="flex w-full max-w-5xl flex-col items-center text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            {/* 3. Badge Styling: Dark text/border for light mode, Light text/border for dark mode */}
            <div className="relative inline-flex items-center gap-2 rounded-full 
              border border-black/10 bg-black/5 
              dark:border-white/10 dark:bg-white/5 
              px-4 py-1.5 text-xs font-medium uppercase tracking-widest 
              text-emerald-700 dark:text-emerald-300 
              backdrop-blur-md transition-colors hover:bg-black/10 dark:hover:bg-white/10">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Accepting New Projects
            </div>
          </motion.div>

          {/* Main Typography */}
          <div className="relative z-10 mb-6 flex w-full flex-col items-center justify-center">
            {/* Glow Effect - Adjusted to be subtle in light mode, stronger in dark */}
            <motion.div
              className="absolute -z-10 h-[150px] w-[300px] rounded-full pointer-events-none
                bg-blue-500/10 dark:bg-blue-500/20 blur-[100px]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            <motion.h1
              className="sr-only"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              iidev
            </motion.h1>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-6xl md:text-8xl font-extrabold text-black tracking-tight">
                iidev
              </h1>
            </motion.div>
          </div>

          {/* 5. Divider Line: Darker in light mode, Lighter in dark mode */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="mb-8 h-px w-32 md:w-64
            bg-gradient-to-r from-transparent via-black/20 to-transparent
            dark:via-white/40"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-10 max-w-xl px-4 text-base font-light leading-relaxed md:text-xl
            text-slate-600 dark:text-slate-400"
          >
            {/* 6. Spans: Explicitly switch from black to white based on mode */}
            Crafting immersive digital experiences where <span className="font-medium text-black dark:text-white">design</span> meets <span className="font-medium text-black dark:text-white">functionality</span>.
            An audiovisual odyssey for the modern web.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col gap-6 sm:flex-row items-center"
          >
            {/* 1. PRIMARY BUTTON: Shimmer Effect */}
            <button className="group relative h-12 w-48 overflow-hidden rounded-full bg-neutral-950 dark:bg-white shadow-lg transition-all hover:scale-105 active:scale-95">
              {/* Shimmer Animation */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-black/10 to-transparent z-10" />

              <span className="relative z-20 text-sm font-semibold tracking-wide text-white dark:text-black">
                Start a Project
              </span>
            </button>

            {/* 2. SECONDARY BUTTON: Fill Effect */}
            <button className="group relative h-12 w-48 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent transition-all active:scale-95">
              {/* Hover Fill Background */}
              <div className="absolute inset-0 translate-y-full bg-neutral-900 dark:bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />

              <span className="relative z-10 flex items-center justify-center text-sm font-semibold tracking-wide 
                text-neutral-900 dark:text-white 
                transition-colors duration-300 group-hover:text-white dark:group-hover:text-black">
                View Portfolio
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 7. Bottom Fade: Fades to the background color (white in light, black in dark) */}
      {/* <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-background to-transparent pointer-events-none z-20" /> */}
    </section>
  );
}