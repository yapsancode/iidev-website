"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Ghost, MoveLeft } from "lucide-react";

export default function NotFound() {
    const [isHovering, setIsHovering] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Mouse position state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the ghost follower
    const springConfig = { damping: 25, stiffness: 150 };
    const ghostX = useSpring(mouseX, springConfig);
    const ghostY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 24); // Center the ghost (assuming 48px width)
            mouseY.set(e.clientY - 24);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 text-neutral-100 selection:bg-purple-500/30">

            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
                <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            {/* Ghost Follower */}
            <motion.div
                style={{ x: ghostX, y: ghostY }}
                className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
                animate={{
                    scale: isHovering ? 1.2 : 1,
                    rotate: isHovering ? 10 : 0,
                }}
            >
                <div className="relative">
                    <Ghost className={`h-12 w-12 ${isHovering ? "text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "text-neutral-400/50"}`} />
                    {/* Little glow effect under the ghost */}
                    <div className="absolute -inset-4 -z-10 rounded-full bg-purple-500/20 blur-xl opacity-0 transition-opacity duration-300"
                        style={{ opacity: isHovering ? 1 : 0 }}
                    />
                </div>
            </motion.div>

            {/* Content */}
            <div className="z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-[12rem] font-bold leading-none tracking-tighter text-neutral-900 md:text-[16rem] lg:text-[20rem] select-none dark:text-neutral-800">
                        404
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-6"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Lost in the Void?
                        </h2>
                        <p className="text-neutral-400 max-w-md mx-auto">
                            The page you are looking for has drifted away into the unknown.
                            Let's get you back to safety.
                        </p>
                    </div>

                    <Link
                        href="/"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white/10 px-8 py-3 font-medium text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-sm"
                    >
                        <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Return Home</span>
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                </motion.div>
            </div>

            {/* Decorative floating particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-white/20"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
