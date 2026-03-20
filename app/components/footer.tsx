'use client';

import React from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const shortcuts = [
        { name: "Home", id: "home" },
        { name: "About", id: "about" },
        { name: "Skills", id: "skills" },
        { name: "Projects", id: "projects" },
        { name: "Contact", id: "contact" }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const st = ScrollTrigger.getAll().find(t => t.trigger === element);
            const targetPos = st ? st.start : element.offsetTop;

            window.scrollTo({
                top: targetPos,
                behavior: "smooth"
            });
        }
    };

    const socials = [
        {
            name: "TikTok",
            url: "https://www.tiktok.com/@moh.rashard",
            icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>,
            hoverColor: "hover:border-[#EE1D52] hover:text-[#EE1D52]"
        },
        {
            name: "Facebook",
            url: "https://web.facebook.com/MohRashard",
            icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
            hoverColor: "hover:border-[#1877F2] hover:text-[#1877F2]"
        },
        {
            name: "Instagram",
            url: "https://www.instagram.com/moh_.rashaxd/",
            icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>,
            hoverColor: "hover:border-[#E1306C] hover:text-[#E1306C]"
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/mohamedrashard",
            icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
            hoverColor: "hover:border-[#00E5FF] hover:text-[#00E5FF]"
        },
        {
            name: "GitHub",
            url: "https://github.com/mohrashard/",
            icon: <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>,
            hoverColor: "hover:border-[#7B5EA7] hover:text-[#7B5EA7]"
        }
    ];

    return (
        <footer className="relative w-full bg-[#060608] border-t border-white/5 pt-24 pb-8 overflow-hidden">

            {/* Subtle Ambient Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-24">

                    {/* ── BRAND COLUMN (Spans 5 cols) ───────────────────────────────── */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col">
                        <Link href="/" className="inline-block mb-6 group w-fit">
                            <span className="text-3xl font-black tracking-tighter text-[#F5F0E8] transition-colors" style={{ fontFamily: '"Syne", sans-serif' }}>
                                Mohamed <span className="text-[#00E5FF] group-hover:text-[#7B5EA7] transition-colors duration-300">Rashard</span>
                            </span>
                        </Link>
                        <p className="font-mono text-[12px] leading-[1.8] text-[#F5F0E8]/50 max-w-sm mb-8">
                            Software Engineer & AI Architect. Pioneering intelligent solutions, custom software ecosystems, and futuristic digital experiences from Colombo to the world.
                        </p>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
                            </span>
                            Systems Online
                        </div>
                    </div>

                    {/* ── SHORTCUTS COLUMN (Spans 3 cols) ───────────────────────────── */}
                    <div className="col-span-1 md:col-span-6 lg:col-span-3 lg:col-start-7 flex flex-col">
                        <h4 className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-8">
                            // Directories
                        </h4>
                        <ul className="flex flex-col gap-4">
                            {shortcuts.map((link, idx) => (
                                <li key={idx}>
                                    <button
                                        onClick={() => scrollToSection(link.id)}
                                        className="group flex items-center gap-3 w-fit cursor-pointer outline-none"
                                    >
                                        <svg className="w-3 h-3 text-[#00E5FF] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                                        <span className="font-mono text-[13px] text-[#F5F0E8]/60 group-hover:text-[#F5F0E8] transition-colors duration-300">
                                            {link.name}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── NETWORK & LEGAL COLUMN (Spans 3 cols) ──────────────────────── */}
                    <div className="col-span-1 md:col-span-6 lg:col-span-3 flex flex-col">
                        <h4 className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-8">
                            // Network
                        </h4>

                        {/* Social Icons Grid */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            {socials.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className={`w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#F5F0E8]/50 transition-all duration-300 ${social.hoverColor} hover:bg-white/[0.05] hover:-translate-y-1`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 font-mono text-[11px] text-[#F5F0E8]/40">
                            <svg className="w-4 h-4 text-[#7B5EA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Colombo, Sri Lanka
                        </div>
                    </div>

                </div>

                {/* ── BOTTOM COPYRIGHT BAR ─────────────────────────────────────── */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-mono text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase text-center md:text-left">
                        &copy; {currentYear} Mohamed Rashard Rizmi. All rights reserved.
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-[#F5F0E8]/30 uppercase flex items-center gap-2">
                        System Architected by <span className="text-[#00E5FF]">MRR</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}