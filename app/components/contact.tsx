'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useCanvasSequence } from '../hooks/useCanvasSequence';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const CONTACT_FRAME_COUNT = 121;

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);

    const headlineText = "Let's build something impossible.";

    const { loadImages, scheduleRender, setSize, render, purge } = useCanvasSequence({
        canvasRef,
        frameCount: CONTACT_FRAME_COUNT,
        frameDir: 'contact',
    });

    useEffect(() => {
        const container = sectionRef.current;
        if (!container) return;

        let ctx: gsap.Context;
        const seq = { frame: 0 };
        const isMobile = window.innerWidth < 768;
        const frameStep = isMobile ? 2 : 1;
        const totalFrames = Math.floor((CONTACT_FRAME_COUNT - 1) / frameStep) + 1;

        ctx = gsap.context(() => {
            setSize();

            ScrollTrigger.create({
                trigger: container,
                start: 'top bottom+=1000px',
                end: 'bottom top-=1000px',
                onEnter: loadImages,
                onEnterBack: loadImages,
                onLeave: purge,
                onLeaveBack: purge,
            });

            gsap.to(seq, {
                frame: totalFrames - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                    onRefresh: () => render(seq.frame)
                },
                onUpdate: () => scheduleRender(seq.frame)
            });

            // ── Theater Curtain Headline Reveal ──
            gsap.fromTo(".word-reveal",
                { y: "120%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.08,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 40%"
                    }
                }
            );

            // ── Scroll-Driven Node Cascade ──
            gsap.fromTo(".contact-node",
                {
                    opacity: 0,
                    y: 80,
                    scale: 0.95,
                    rotateX: -10
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    duration: 1.5,
                    stagger: 0.3,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 15%"
                    }
                }
            );

            // ── Footer Fade In ──
            gsap.fromTo(".contact-footer",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top -10%"
                    }
                }
            );

            const handleResize = () => { setSize(); render(seq.frame); };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, container);

        return () => {
            ctx.revert();
            purge();
        };
    }, [loadImages, scheduleRender, setSize, render, purge]);

    return (
        <section ref={sectionRef} id="contact" className="relative w-full bg-[#060608] min-h-[150vh]">

            {/* ── STICKY CANVAS BACKGROUND ──────────────────────────────────── */}
            <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none z-0">
                <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    aria-label="Interactive 3D network nodes background animation"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#060608] via-black/60 to-transparent" />
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,6,8,0.8)_100%)]" />
            </div>

            {/* ── FOREGROUND CONTENT ────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center z-10 pointer-events-none px-6 md:px-12" style={{ perspective: '1000px' }}>
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center pointer-events-auto">

                    <p className="font-mono text-[10px] md:text-[12px] tracking-[0.4em] text-[#00E5FF]/50 mb-8 uppercase drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                        AVAILABLE_FOR_REMOTE_GLOBAL = TRUE
                    </p>

                    {/* Custom Split-Text Headline */}
                    <h2 ref={headlineRef} className="text-4xl md:text-6xl lg:text-[72px] font-black text-[#F5F0E8] tracking-tighter mb-20 flex flex-wrap justify-center gap-x-3 md:gap-x-5 text-center leading-[1.1]" style={{ fontFamily: '"Syne", sans-serif' }}>
                        {headlineText.split(" ").map((word, i) => (
                            <span key={i} className="overflow-hidden inline-block pb-2">
                                <span className="word-reveal inline-block origin-bottom drop-shadow-2xl">{word.replace("'", "\u2019")}</span>
                            </span>
                        ))}
                    </h2>

                    {/* ── MASSIVE INTERACTIVE LINKS ───────────────────────────────── */}
                    <div className="w-full flex flex-col gap-4 mb-24">

                        {/* Email Node */}
                        <a
                            href="mailto:mohrashard@gmail.com"
                            className="contact-node transform-style-3d group relative flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_0_40px_rgba(0,229,255,0.1)] will-change-transform transform-gpu"
                        >
                            {/* Hover Sweep Line */}
                            <div className="absolute left-0 bottom-0 h-1 w-0 bg-[#00E5FF] transition-all duration-700 ease-out group-hover:w-full" />

                            <div className="flex flex-col mb-4 md:mb-0">
                                <span className="font-mono text-[10px] tracking-[0.3em] text-[#00E5FF] uppercase mb-2">01 // Direct Transmission</span>
                                <span className="font-bold text-2xl md:text-4xl text-[#F5F0E8] tracking-tight group-hover:text-[#00E5FF] transition-colors duration-300" style={{ fontFamily: '"Syne", sans-serif' }}>
                                    mohrashard@gmail.com
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="font-mono text-sm text-white/30 group-hover:text-white transition-colors duration-300 uppercase tracking-widest">Initiate</span>
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00E5FF] group-hover:border-[#00E5FF] transition-all duration-300 transform group-hover:translate-x-2">
                                    <svg className="w-5 h-5 text-white group-hover:text-[#060608] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </div>
                            </div>
                        </a>

                        {/* LinkedIn Node */}
                        <a
                            href="https://www.linkedin.com/in/mohamedrashard"
                            target="_blank" rel="noopener noreferrer"
                            className="contact-node transform-style-3d group relative flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_0_40px_rgba(123,94,167,0.15)] will-change-transform transform-gpu"
                        >
                            {/* Hover Sweep Line */}
                            <div className="absolute left-0 bottom-0 h-1 w-0 bg-[#7B5EA7] transition-all duration-700 ease-out group-hover:w-full" />

                            <div className="flex flex-col mb-4 md:mb-0">
                                <span className="font-mono text-[10px] tracking-[0.3em] text-[#7B5EA7] uppercase mb-2">02 // Professional Network</span>
                                <span className="font-bold text-2xl md:text-4xl text-[#F5F0E8] tracking-tight group-hover:text-[#7B5EA7] transition-colors duration-300" style={{ fontFamily: '"Syne", sans-serif' }}>
                                    /in/mohamedrashard
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="font-mono text-sm text-white/30 group-hover:text-white transition-colors duration-300 uppercase tracking-widest">Connect</span>
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#7B5EA7] group-hover:border-[#7B5EA7] transition-all duration-300 transform group-hover:translate-x-2">
                                    <svg className="w-5 h-5 text-white group-hover:text-[#060608] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </div>
                            </div>
                        </a>

                    </div>

                    {/* ── FOOTER ────────────────────────────────────────────────── */}
                    <div className="contact-footer w-full flex flex-col items-center gap-4 mt-auto">
                        <div className="flex justify-center gap-6 font-mono text-[10px] md:text-[12px] tracking-[0.4em] text-[#F5F0E8]/40 uppercase">
                            <span className="hover:text-white transition-colors cursor-default">Colombo, Sri Lanka</span>
                            <span className="opacity-30">·</span>
                            <span className="hover:text-white transition-colors cursor-default">MOHAMEDRASHARD.DEV</span>
                        </div>
                        <div aria-hidden="true" className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
                    </div>

                </div>
            </div>

        </section>
    );
}