import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar = () => {
    const navItems = [
        { label: 'PROBLEMS', href: '#problems' },
        { label: 'WHY US', href: '#why-us' },
        { label: 'PORTFOLIO', href: '#portfolio' },
        { label: 'TEAM', href: '#team' },
        { label: 'SERVICES', href: '#services' },
        // { label: 'SEE A DEMO', href: '#demo' },
    ];

    // Added separate desktop items to match the user's original more extensive desktop list
    const desktopNavItems = [
        { label: 'PROBLEMS', href: '#problems' },
        { label: 'WHY US', href: '#why-us' },
        { label: 'PORTFOLIO', href: '#portfolio' },
        { label: 'TEAM', href: '#team' },
        { label: 'SERVICES', href: '#services' },
        // { label: 'SEE A DEMO', href: '#demo' },
    ];

    const [activeSection, setActiveSection] = useState('home');
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [mobileMenuOpen]);

    // Smooth scroll handler
    const handleNavClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            // Tiny timeout to allow menu to close visually before scrolling starts
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    };

    // Intersection Observer for scroll spying
    useEffect(() => {
        const sections = ['home', ...desktopNavItems.map(item => item.href.slice(1))];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        );

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Animation Variants
    const menuVariants: Variants = {
        closed: {
            opacity: 0,
            transition: { duration: 0.3, delay: 0.2 }
        },
        open: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const linkContainerVariants: Variants = {
        open: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        closed: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const linkVariants: Variants = {
        open: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
        closed: { y: 20, opacity: 0, transition: { duration: 0.2 } }
    };

    return (
        <>
            {/* --- Main Navbar (Visible when menu closed) --- */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 md:px-12 pointer-events-none`}
            >
                {/* Logo - visible on desktop, or mobile when menu closed */}
                <motion.button
                    layout
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    onMouseEnter={() => setIsLogoHovered(true)}
                    onMouseLeave={() => setIsLogoHovered(false)}
                    className={`pointer-events-auto flex items-center gap-1 bg-black text-white dark:bg-white dark:text-black px-4 py-3 text-xs font-bold tracking-widest uppercase cursor-pointer select-none transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                >
                    <motion.span layout>iidev</motion.span>
                    <AnimatePresence>
                        {isLogoHovered && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden whitespace-nowrap"
                            >
                                Studio
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Desktop Menu - Center Pills */}
                <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-[#F0F0F0]/90 dark:bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    {desktopNavItems.map((item) => {
                        const isActive = activeSection === item.href.slice(1);
                        return (
                            <button
                                key={item.label}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className={`relative px-5 py-2 rounded-full text-[11px] font-bold tracking-widest transition-colors duration-300
                                    ${isActive ? 'text-black dark:text-black' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-neutral-800/50'}`}
                            >
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activePill"
                                        className="absolute inset-0 bg-white shadow-md border border-black/5 rounded-full -z-10"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                    <div className="mx-1 h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
                    <ThemeToggle />
                </div>

                {/* Mobile Toggle Button - Only visible when menu is CLOSED */}
                <div className="pointer-events-auto md:hidden">
                    <AnimatePresence>
                        {!mobileMenuOpen && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileMenuOpen(true)}
                                className="flex flex-col gap-1.5 p-2"
                                aria-label="Open menu"
                            >
                                <div className="h-0.5 w-6 bg-black rounded-full" />
                                <div className="h-0.5 w-6 bg-black rounded-full" />
                                <div className="h-0.5 w-4 bg-black rounded-full self-end" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* --- Mobile Full Screen Menu Overlay --- */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-50 flex flex-col bg-[#E6E6E6] text-black overflow-y-auto"
                    >
                        {/* Top Header Row inside Menu */}
                        <div className="flex justify-between items-start p-6">
                            {/* Brand Button (Top Left) */}
                            <motion.button
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-[#EFEEE9] dark:bg-neutral-800 px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm shadow-sm hover:bg-white dark:hover:bg-neutral-700 transition-colors text-black dark:text-white"
                            >
                                iidev Studio
                            </motion.button>

                            <div className="flex items-center gap-4">
                                <ThemeToggle />
                                {/* Close Button (Top Right) */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="bg-[#111] dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full text-[10px] font-bold tracking-[0.2em] hover:bg-black dark:hover:bg-gray-200 transition-colors"
                                >
                                    CLOSE
                                </motion.button>
                            </div>
                        </div>

                        {/* Centered Navigation Links */}
                        <motion.div
                            variants={linkContainerVariants}
                            className="flex-1 flex flex-col justify-center items-center gap-5 w-full min-h-[400px]"
                        >
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.label}
                                    variants={linkVariants}
                                    className="relative group"
                                >
                                    <button
                                        onClick={(e) => handleNavClick(e, item.href)}
                                        className="relative z-10 block w-40 py-4 bg-[#F1F0EB] rounded-[2rem] text-center text-xl font-normal tracking-wide shadow-sm border border-transparent transition-transform duration-200 active:scale-95 group-hover:-translate-y-1"
                                    >
                                        {item.label}
                                    </button>
                                    {/* Optional subtle shadow element for 3D effect */}
                                    <div className="absolute inset-0 bg-[#D6D6D6] rounded-[2rem] transform translate-y-1 z-0 transition-transform group-hover:translate-y-2" />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Footer Info Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="pb-10 flex flex-col items-center gap-8 text-[11px] font-bold text-neutral-800 tracking-widest uppercase"
                        >
                            {/* Socials */}
                            <div className="flex flex-col items-center gap-3">
                                <span className="bg-[#EFEEE9] px-2 py-1 rounded-[2px]">Follow</span>
                                <div className="flex gap-6 mt-1">
                                    <a href="https://www.linkedin.com/company/iidevstudio" target="_blank" className="hover:text-neutral-500 transition-colors">LinkedIn</a>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex gap-2">
                                    <span className="bg-[#EFEEE9] px-2 py-1 rounded-[2px]">General</span>
                                    <span className="bg-[#EFEEE9] px-2 py-1 rounded-[2px]">Enquiries</span>
                                </div>
                                <a href="mailto:team.iidevstudio@gmail.com" className="mt-1 lowercase tracking-normal text-sm font-normal text-neutral-600 hover:text-black">
                                    team.iidevstudio@gmail.com
                                </a>
                            </div>

                            {/* Copyright */}
                            <div className="mt-4 text-[10px] text-neutral-500 font-normal normal-case tracking-normal">
                                © 2025 iidev Studio® All Rights Reserved
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </>
    );
};