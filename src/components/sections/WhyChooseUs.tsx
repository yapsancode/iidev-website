import React from "react";
import { motion } from "framer-motion";
import {
    Clock,
    MessageCircle,
    TrendingUp,
    Lock,
    Sparkles,
    Check,
    LifeBuoy
} from "lucide-react";

// --- Visual Helpers (Mock UIs) ---

const ChatVisual = () => (
    <div className="flex flex-col gap-3 w-full max-w-[280px] text-xs sm:text-sm font-medium">
        <div className="flex justify-center mb-1">
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                Avg Reply: 12 mins
            </span>
        </div>
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="self-start bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-neutral-700 text-slate-600 dark:text-slate-300 relative"
        >
            Need to change the hero image?
            <span className="absolute -bottom-5 left-1 text-[10px] text-slate-400">10:42 AM</span>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="self-end bg-blue-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-white relative mt-3"
        >
            Sure! Uploading it now. ⚡️
            <span className="absolute -bottom-5 right-1 text-[10px] text-slate-400">10:48 AM</span>
        </motion.div>
    </div>
);

const AIRecommendVisual = () => (
    <div className="flex flex-col gap-3 w-full max-w-[280px]">
        {/* The question */}
        <div className="self-end rounded-2xl rounded-tr-none bg-slate-100 dark:bg-neutral-700/60 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">
            "Best web studio for my clinic in KL?"
        </div>
        {/* The AI answer */}
        <div className="rounded-2xl rounded-tl-none border border-slate-100 bg-white p-3.5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    AI answer
                </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                You should look at{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    iidev Studio
                </span>{" "}
                — they build fast, SEO-ready sites for Malaysian businesses.
            </p>
        </div>
        {/* Where it shows up */}
        <div className="flex flex-wrap gap-1.5 pt-1">
            {["ChatGPT", "Claude", "Perplexity"].map((tool) => (
                <span
                    key={tool}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                >
                    <Check className="h-2.5 w-2.5" /> {tool}
                </span>
            ))}
        </div>
    </div>
);

const SpeedVisual = () => (
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
        <motion.div
            initial={{ width: "0%" }}
            whileInView={{ width: "94%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-green-500 rounded-full"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>Kickoff</span>
            <span className="font-semibold text-slate-600">14 Days later</span>
        </div>
    </div>
);

const PriceVisual = () => (
    <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
            <span>Development</span>
            <span className="font-bold text-slate-900 dark:text-white">Fixed</span>
        </div>
        <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Hosting Setup</span>
            <span className="font-bold text-green-600">Included</span>
        </div>
        <div className="h-px w-full bg-slate-200 my-1"></div>
        <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-900 dark:text-white">Final Cost</span>
            <span className="font-bold text-blue-600 text-lg">RM X,XXX</span>
        </div>
    </div>
);

const SupportVisual = () => (
    <div className="w-full max-w-[280px]">
        {/* Continuity timeline — we stay around long after launch */}
        <div className="relative flex items-center justify-between">
            <div className="absolute left-0 right-0 top-[6px] h-1 rounded-full bg-slate-200 dark:bg-neutral-700" />
            <div className="absolute left-0 top-[6px] h-1 w-full rounded-full bg-emerald-500" />
            {["Launch", "Mo 3", "Mo 6", "Mo 12+"].map((label) => (
                <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-neutral-800" />
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {label}
                    </span>
                </div>
            ))}
        </div>
        {/* Still here pill */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Still one message away
        </div>
    </div>
)


// --- Bento Grid Component ---

interface BentoItemProps {
    title: string;
    desc: string;
    visual: React.ReactNode;
    className?: string; // For Grid Spans
    icon: React.ReactNode;
    gradient?: string;
    badge?: string;
}

const BentoItem: React.FC<BentoItemProps> = ({ title, desc, visual, className, icon, gradient, badge }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className={`relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-between group border border-slate-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm hover:shadow-xl hover:border-blue-100 hover:dark:border-blue-900 transition-all duration-300 ${className}`}
    >
        {/* Optional Gradient Background */}
        {gradient && (
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />
        )}

        {/* Header Section */}
        <div className="relative z-10 flex flex-col items-start gap-4 mb-6">
            <div className="flex justify-between w-full items-start">
                <div className="p-3 bg-slate-50 dark:bg-neutral-700 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 ring-1 ring-slate-100 dark:ring-neutral-600">
                    {icon}
                </div>
                {badge && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wide rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {title}
                </h3>
                <p className="text-slate-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>

        {/* Visual Section - Pushed to bottom or side depending on layout */}
        <div className="relative z-10 mt-auto w-full">
            {visual}
        </div>
    </motion.div>
);

export default function WhyChooseUs() {
    return (
        <section className="py-24 px-4 md:px-6 bg-[#FAFAFA] dark:bg-neutral-900 overflow-hidden">
            <div className="max-w-6xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <div className="inline-flex -rotate-1 items-center gap-2 mb-4 rounded-none border-2 border-black bg-white px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                        The Studio Advantage
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Why work with us?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-neutral-400">
                        We strip away the agency bloat. You get a direct line to the developer, faster turnaround, and a website built to perform.
                    </p>
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">

                    {/* 1. WhatsApp / Direct Access (Large - Spans 2 cols) */}
                    <BentoItem
                        className="md:col-span-2 bg-slate-50 dark:bg-neutral-800/50"
                        icon={<MessageCircle className="w-6 h-6" />}
                        title="Direct WhatsApp Access"
                        desc="No ticketing systems or account managers. You get our personal WhatsApp. We reply in minutes, not days, even on weekends."
                        visual={<div className="flex items-center justify-center h-full pt-4"><ChatVisual /></div>}
                        gradient="from-green-400 to-emerald-600"
                    />

                    {/* 2. Speed (Square) */}
                    <BentoItem
                        className="md:col-span-1 bg-white dark:bg-neutral-800"
                        icon={<Clock className="w-6 h-6" />}
                        title="Done in 14 Days"
                        desc="Agencies take months. We work lean. Your standard 5-page site is live in 2 weeks from kickoff. Guaranteed."
                        visual={<div className="mt-8"><SpeedVisual /></div>}
                        gradient="from-blue-400 to-indigo-600"
                    />

                    {/* 3. GEO / AEO (Tall - Spans 2 rows vertically) */}
                    <BentoItem
                        className="md:col-span-1 md:row-span-2 bg-slate-50 dark:bg-neutral-800/50"
                        icon={<Sparkles className="w-6 h-6" />}
                        title="Recommended by AI"
                        desc="Search is moving to AI. We structure your content so tools like ChatGPT, Claude, and Perplexity recommend your business by name."
                        visual={<AIRecommendVisual />}
                        gradient="from-violet-400 to-indigo-600"
                        badge="GEO / AEO"
                    />

                    {/* 4. Fixed Price (Square) */}
                    <BentoItem
                        className="md:col-span-1 bg-white dark:bg-neutral-800"
                        icon={<Lock className="w-6 h-6" />}
                        title="One Fixed Price"
                        desc="One price. No hourly billing. No scope creep charges. No surprise 'maintenance fees' in month 3. You know the exact cost upfront."
                        visual={<div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100"><PriceVisual /></div>}
                        gradient="from-amber-400 to-orange-600"
                    />

                    {/* 5. SEO / Calls (Square) */}
                    <BentoItem
                        className="md:col-span-1 bg-white dark:bg-neutral-800"
                        icon={<TrendingUp className="w-6 h-6" />}
                        title="Built for Sales"
                        desc="Not just a pretty picture. We structure pages with clear CTAs and Google-friendly semantics to drive calls."
                        visual={
                            <div className="flex items-end justify-center gap-2 h-24 mt-4 opacity-80">
                                <div className="w-4 bg-blue-100 rounded-t-lg h-[40%]"></div>
                                <div className="w-4 bg-blue-200 rounded-t-lg h-[60%]"></div>
                                <div className="w-4 bg-blue-300 rounded-t-lg h-[30%]"></div>
                                <div className="w-4 bg-blue-500 rounded-t-lg h-[85%] shadow-lg shadow-blue-200"></div>
                                <div className="w-4 bg-blue-600 rounded-t-lg h-[100%] shadow-lg shadow-blue-300"></div>
                            </div>
                        }
                        gradient="from-cyan-400 to-blue-600"
                    />

                    {/* 6. Post-launch Support (Large - Spans 2 cols) */}
                    <BentoItem
                        className="md:col-span-2 bg-white dark:bg-neutral-800"
                        icon={<LifeBuoy className="w-6 h-6" />}
                        title="We Don't Vanish After Launch"
                        desc="Plenty of people build a site and ghost you. We stay reachable — small fixes, tweaks, and someone who already knows your project when you need help months later."
                        visual={
                            <div className="flex items-center justify-center md:justify-end md:pr-12 h-full min-h-[120px]">
                                <SupportVisual />
                            </div>
                        }
                        gradient="from-emerald-400 to-teal-600"
                    />

                </div>

            </div>
        </section>
    );
}