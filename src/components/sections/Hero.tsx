"use client"
import { motion } from 'framer-motion';
import { WaveCanvas } from '../ui/wave-canvas';
import { TypewriterText } from '../ui/TypewriterText';
import { ContainerScroll } from '../ui/container-scroll-animation';

interface HeroProps {
  onBookingClick: () => void;
}

export function Hero({ onBookingClick }: HeroProps) {

  const handleViewServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative w-full overflow-visible bg-[#FAFAFA] dark:bg-neutral-900">
      {/* Canvas: Ensure it sits behind content (z-0) - Fixed position to stay while scrolling if desired, but absolute is fine for now */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <WaveCanvas className="opacity-60" />
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none select-none h-full w-full">
        <div className="absolute h-full w-full bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Status Badge */}
              <div className="relative inline-flex items-center gap-2 rounded-full 
                  border border-black/10 bg-black/5 
                  dark:border-white/10 dark:bg-white/5 
                  px-4 py-1.5 text-xs font-medium uppercase tracking-widest 
                  text-indigo-700 dark:text-indigo-300 
                  backdrop-blur-md transition-colors hover:bg-black/10 dark:hover:bg-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                Accepting New Projects
              </div>

              {/* Main Heading */}
              <h1 className="sr-only">iidev - We Don't Just Build Websites, We Help Business Thrive.</h1>
              <div className="relative z-20">
                <TypewriterText
                  text="We Don't Just Build Websites, We Help Business Thrive."
                  className="text-6xl md:text-8xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1]"
                  delay={0.1}
                  pauseAfter=","
                  pauseDuration={1.5}
                />
              </div>

              <div className="h-px w-32 md:w-64 bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/40" />

              <p className="max-w-xl px-4 text-base font-light leading-relaxed md:text-xl text-slate-600 dark:text-slate-400">
                Crafting immersive digital experiences where <span className="font-medium text-black dark:text-white">design</span> meets <span className="font-medium text-black dark:text-white">functionality</span>.
                Software tailored to your needs.
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-6 sm:flex-row items-center pt-4">
                <button
                  onClick={onBookingClick}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-sm uppercase"
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
              </div>
            </div>
          }
        >

          {/* Mock Terminal Card Content */}
          <div className="h-full w-full bg-[#1e1e1e] rounded-2xl flex flex-col items-start justify-start p-6 overflow-hidden relative shadow-inner border border-white/5 font-mono text-left">
            {/* Window Controls */}
            <div className="flex gap-2 mb-6 border-b border-white/10 w-full pb-4">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              <div className="ml-4 text-xs text-stone-500 flex-1 text-center font-sans tracking-wide">iidev-studio — bash — 80x24</div>
            </div>

            {/* Code Content */}
            <div className="text-sm md:text-base w-full flex-1 overflow-y-auto custom-scrollbar">
              <div className="mb-2">
                <span className="text-[#c586c0]">import</span> <span className="text-[#9cdcfe]">{`{ Future }`}</span> <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">'./digital-evolution'</span>;
              </div>
              <div className="mb-2">
                <span className="text-[#c586c0]">const</span> <span className="text-[#4fc1ff]">project</span> <span className="text-[#d4d4d4]">=</span> <span className="text-[#c586c0]">new</span> <span className="text-[#4ec9b0]">Future</span>({`{`}
              </div>
              <div className="pl-6 mb-1">
                <span className="text-[#9cdcfe]">client</span>: <span className="text-[#ce9178]">'Visionary'</span>,
              </div>
              <div className="pl-6 mb-1">
                <span className="text-[#9cdcfe]">stack</span>: [<span className="text-[#ce9178]">'Next.js'</span>, <span className="text-[#ce9178]">'Tailwind'</span>, <span className="text-[#ce9178]">'Motion'</span>],
              </div>
              <div className="pl-6 mb-1">
                <span className="text-[#9cdcfe]">goal</span>: <span className="text-[#ce9178]">'Market Dominance'</span>
              </div>
              <div className="mb-2">
                {`}`});
              </div>
              <br />
              <div className="mb-2">
                <span className="text-[#6a9955]">// Initializing build process...</span>
              </div>
              <div>
                <span className="text-[#dcdcaa]">project</span>.<span className="text-[#dcdcaa]">launch</span>().<span className="text-[#dcdcaa]">then</span>(() <span className="text-[#569cd6]">=&gt;</span> {`{`}
              </div>
              <div className="pl-6">
                <span className="text-[#9cdcfe]">console</span>.<span className="text-[#dcdcaa]">log</span>(<span className="text-[#ce9178]">'🚀 Ready for liftoff!'</span>);
              </div>
              <div>
                {`}`});
              </div>

              <div className="mt-6 flex items-center">
                <span className="text-[#3c7e46] mr-2">➜</span>
                <span className="text-[#569cd6]">~</span>
                <span className="ml-2 animate-pulse inline-block w-2.5 h-5 bg-stone-400 align-middle"></span>
              </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}
