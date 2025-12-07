import React from "react";
import { motion } from "framer-motion";
import {
    Check,
    Clock,
    MessageCircle,
    TrendingUp,
    MousePointer2,
    Lock,
    Smartphone,
    ArrowRight,
    Star
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

const MobileVisual = () => (
    <div className="relative w-32 h-48 mx-auto bg-slate-900 rounded-[2rem] ring-4 ring-slate-100 dark:ring-neutral-800 shadow-xl overflow-hidden mt-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 rounded-b-lg z-10"></div>
        <div className="w-full h-full bg-white dark:bg-neutral-900 flex flex-col pt-6 px-2 gap-2">
            <div className="w-full h-24 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse"></div>
            <div className="w-2/3 h-4 bg-slate-100 dark:bg-neutral-800 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-slate-100 dark:bg-neutral-800 rounded animate-pulse"></div>
            <div className="mt-auto w-full h-8 bg-blue-600 rounded-lg mb-2 opacity-90 flex items-center justify-center text-white text-[10px] font-bold">
                Load Time: 0.8s
            </div>
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

const OwnershipVisual = () => (
    <div className="relative group cursor-default">
        <div className="absolute -right-4 -bottom-4 md:-right-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
            <MousePointer2 className="w-24 h-24 text-slate-800 fill-slate-800/20 rotate-12" />
        </div>
        <div className="bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg p-3 shadow-sm max-w-[200px] transform group-hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px]">👤</div>
                    <div className="text-[10px] font-semibold text-slate-700">Role: Admin</div>
                </div>
                <div className="h-px bg-slate-100 w-full"></div>
                <div className="flex justify-end mt-1">
                    <div className="px-2 py-1 bg-blue-600 rounded text-[10px] text-white flex items-center justify-center">Edit Content</div>
                </div>
            </div>
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100 dark:border-blue-800">
                        The Freelance Advantage
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

                    {/* 3. Mobile First (Tall - Spans 2 rows vertically) */}
                    <BentoItem
                        className="md:col-span-1 md:row-span-2 bg-slate-50 dark:bg-neutral-800/50"
                        icon={<Smartphone className="w-6 h-6" />}
                        title="Tested on 15+ Devices"
                        desc="Your customers are on phones. We build mobile-first, ensuring your site loads under 2s on 4G networks (Maxis/Digi tested)."
                        visual={<MobileVisual />}
                        gradient="from-purple-400 to-pink-600"
                        badge="Mobile First"
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

                    {/* 6. Ownership (Large - Spans 2 cols) */}
                    <BentoItem
                        className="md:col-span-2 bg-white dark:bg-neutral-800"
                        icon={<Check className="w-6 h-6" />}
                        title="Full Control From Day One"
                        desc="We don't hold your site hostage. Once paid, you get full admin access, all source files, and a 20-minute training video to make updates yourself."
                        visual={
                            <div className="flex items-center justify-center md:justify-end md:pr-12 h-full min-h-[120px]">
                                <OwnershipVisual />
                            </div>
                        }
                        gradient="from-rose-400 to-red-600"
                    />

                </div>

                {/* New CTA Section */}
                {/* <div className="mt-16 text-center">
                    <div className="inline-block p-1 bg-slate-50 rounded-full border border-slate-100 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm text-slate-600 font-medium">Trusted by 20+ small businesses</span>
                            <div className="flex text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        Ready to skip the agency markup?
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200">
                            Get a Free Quote
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                            View Portfolio
                        </button>
                    </div>
                </div> */}

            </div>
        </section>
    );
}