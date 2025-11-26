"use client"
import { motion, useScroll, useTransform } from 'framer-motion';
import { WaveCanvas } from '../ui/wave-canvas';
import { TypewriterText } from '../ui/TypewriterText';
import { useMediaQuery } from '@/hooks/use-media-query';

interface HeroProps {
  onBookingClick: () => void;
}

export function Hero({ onBookingClick }: HeroProps) {
  const { scrollY } = useScroll();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Use conditional values for style prop
  const motionStyle = isMobile ? {} : { y, opacity };

  const handleViewServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-svh w-full overflow-hidden bg-background">
      {/* Canvas: Ensure it sits behind content (z-0) */}
      <div className="absolute inset-0 z-0">
        <WaveCanvas className="opacity-60" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute h-full w-full bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 pt-20">
        <motion.div
          style={motionStyle}
          className="flex w-full max-w-5xl flex-col items-center text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
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
              <TypewriterText
                text="We Don't Just Build Websites, We Help Business Thrive."
                className="text-6xl md:text-8xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1]"
                delay={0.1}
                pauseAfter=","
                pauseDuration={1.5}
              />
            </motion.div>
          </div>

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
            Crafting immersive digital experiences where <span className="font-medium text-black dark:text-white">design</span> meets <span className="font-medium text-black dark:text-white">functionality</span>.
            Software tailored to your needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col gap-6 sm:flex-row items-center"
          >
            <button
              onClick={onBookingClick}
              className="bg-emerald-500 hover:bg-emerald-200 text-gray-900 hover:text-black font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase"
            >
              Book Consultation
            </button>

            <button
              onClick={handleViewServices}
              className="group relative h-12 w-48 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent transition-all active:scale-95"
            >
              <div className="absolute inset-0 translate-y-full bg-neutral-900 dark:bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />

              <span className="relative z-10 flex items-center justify-center text-sm font-semibold tracking-wide 
                text-neutral-900 dark:text-white 
                transition-colors duration-300 group-hover:text-white dark:group-hover:text-black">
                View Services
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}