"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Phone,
    FileText,
    PenTool,
    Code2,
    MessageSquare,
    Rocket,
    ShieldCheck,
} from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Discovery",
        description: "We discuss your goals and vision.",
        icon: Phone,
    },
    {
        id: 2,
        title: "Strategy",
        description: "We plan the roadmap and structure.",
        icon: FileText,
    },
    {
        id: 3,
        title: "Design",
        description: "We craft the visuals and user experience.",
        icon: PenTool,
    },
    {
        id: 4,
        title: "Development",
        description: "We build your site with clean code.",
        icon: Code2,
    },
    {
        id: 5,
        title: "Refinement",
        description: "We tweak based on your feedback.",
        icon: MessageSquare,
    },
    {
        id: 6,
        title: "Launch",
        description: "We go live to the world.",
        icon: Rocket,
    },
    {
        id: 7,
        title: "Growth",
        description: "We provide ongoing support.",
        icon: ShieldCheck,
    },
];

const ProcessTimeline = () => {
    return (
        <section className="relative py-24 overflow-hidden bg-[#FAFAFA] dark:bg-neutral-900 transition-colors duration-300">
            {/* Subtle Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
                    >
                        Our Process
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        A seamless journey from concept to launch, designed to deliver excellence.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-gray-200 dark:bg-gray-800 -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-4">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                {/* Numbered Circle with Icon */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 rounded-full bg-white dark:bg-neutral-800 border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:-translate-y-2">
                                        <span className="absolute top-2 right-4 text-xs font-bold text-gray-300 dark:text-gray-600">
                                            0{step.id}
                                        </span>
                                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <step.icon size={24} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    {/* Mobile Connecting Line (Vertical) */}
                                    {index !== steps.length - 1 && (
                                        <div className="md:hidden absolute top-24 left-1/2 w-[1px] h-16 bg-gray-200 dark:bg-gray-800 -translate-x-1/2" />
                                    )}
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[150px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessTimeline;
