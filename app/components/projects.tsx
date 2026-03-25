'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useCanvasSequence } from '../hooks/useCanvasSequence';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const PROJECT_FRAME_COUNT = 121;

// ── THE TOP 4 GOD-TIER PROJECTS ──────────────────────────────────────────────
const featuredProjects = [
    {
        title: "BizFinder AI",
        chip: "AI LEAD GENERATION",
        accent: "#00E5FF",
        description: "Next.js platform enabling businesses to discover high-intent leads using Google Gemini API and SERP extraction.",
        github: "https://github.com/mohrashard/bizfinder-ai",
        liveDemo: "https://bizfinder.mohamedrashard.dev/",
        metrics: ["GEMINI API", "NEXT.JS 15", "LIVE"]
    },
    {
        title: "LiverLens",
        chip: "HEALTH ANALYTICS",
        accent: "#7B5EA7",
        description: "Full-stack React/Flask app integrating an XGBoost AI model for liver disease risk prediction with RBAC.",
        github: "https://github.com/mohrashard/LiverLens",
        liveDemo: null,
        metrics: ["XGBOOST", "FLASK", "REACT"]
    },
    {
        title: "Mentora",
        chip: "WELLNESS ASSESSMENT",
        accent: "#F5F0E8",
        description: "AI platform assessing mental wellness by analyzing lifestyle behavior, generating personalized ML recommendations.",
        github: "https://github.com/mohrashard/mentora.git",
        liveDemo: null,
        metrics: ["RANDOM FOREST", "PYTHON", "AI/ML"]
    },
    {
        title: "OceansFlixx",
        chip: "MEDIA EXPLORER",
        accent: "#00E5FF",
        description: "Responsive web application allowing users to search movies, view details, and discover trending films using TMDb.",
        github: "https://github.com/mohrashard/movie-explorer",
        liveDemo: "https://oceansflixx.vercel.app/",
        metrics: ["REACT", "TMDB API", "UI/UX"]
    }
];

// ── THE SLEEK ARCHIVE (REMAINING 7) ──────────────────────────────────────────
const archiveProjects = [
    { title: "MegaCityCab", type: "Ride Management", tech: "Java, AJAX, MSSQL", link: "https://github.com/mohrashard/MegaCityCab.git" },
    { title: "Amber Bakery", type: "ERP System", tech: "C++, Local Storage", link: "https://github.com/mohrashard/Amber-Bakery-System.git" },
    { title: "Student Management", type: "University System", tech: "Java, OOP, Swing", link: "https://github.com/mohrashard/Student-Management-System.git" },
    { title: "Gallery Cafe", type: "Full-Stack Web", tech: "PHP, MySQL, JS", link: "https://github.com/mohrashard/Gallery-Cafe-Web-Developement-.git" },
    { title: "Dog App", type: "Android Mobile", tech: "Java, Android SDK", link: "https://github.com/mohrashard/Dog-App.git" },
    { title: "Inventory Service", type: "SOA Architecture", tech: "C#, Web Services", link: "https://github.com/mohrashard/Inventory-Management-System.git" },
    { title: "Tasknet Marketplace", type: "Crowd-Sourced Platform", tech: "PHP, HTML/CSS", link: "https://github.com/mohrashard/TaskNet.git" }
];

export default function Projects() {
    const mainRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const archiveRef = useRef<HTMLDivElement>(null);

    const { loadImages, scheduleRender, setSize, render, purge } = useCanvasSequence({
        canvasRef,
        frameCount: PROJECT_FRAME_COUNT,
        frameDir: 'projects',
    });

    useEffect(() => {
        const container = mainRef.current;
        if (!container) return;

        let ctx: gsap.Context;
        const seq = { frame: 0 };
        const isMobile = window.innerWidth < 768;
        const frameStep = isMobile ? 2 : 1;
        const totalFrames = Math.floor((PROJECT_FRAME_COUNT - 1) / frameStep) + 1;

        ctx = gsap.context(() => {
            setSize();

            // ── LIFECYCLE TRIGGER ────────────────────────────────────────────────
            // Manages aggressive preload and delayed purge. By placing purge 3000px 
            // outside the visual boundary, we prevent lag when the user scrolls back 
            // and forth across the exact boundary of the section.
            ScrollTrigger.create({
                trigger: container,
                start: 'top bottom+=3000',
                end: 'bottom top-=3000',
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
                    // On mobile, native touch inertia is already perfectly smooth. Adding JS scrub delay
                    // on top creates input lag. `true` locks the frame exactly to the physical finger.
                    scrub: isMobile ? true : 1.5,
                    pin: bgRef.current,
                    pinSpacing: false,
                    // Load/purge is handled by the Lifecycle Trigger above to provide a 3000px safe zone
                    onRefresh: () => render(seq.frame)
                },
                onUpdate: () => scheduleRender(() => seq.frame)
            });

            cardsRef.current.forEach((card) => {
                if (!card) return;
                gsap.fromTo(card,
                    { rotationY: 90, z: -200, opacity: 0 },
                    {
                        rotationY: 0,
                        z: 0,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
                gsap.set(card, { rotationX: 4 });
            });

            gsap.fromTo(archiveRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: archiveRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
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
        <section ref={mainRef} id="projects" className="relative w-full bg-[#060608]">

            {/* ── THE GSAP PINNED BACKGROUND ─────────────────────────────────── */}
            <div ref={bgRef} className="absolute top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-label="3D background animation showing project evolution"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-[#060608]/75 to-[#060608] backdrop-blur-[2px] will-change-transform transform-gpu" />
            </div>

            {/* ── NORMAL SCROLLING CONTENT ───────────────────────────────────── */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-32">

                {/* Header */}
                <div className="mb-24 text-center flex flex-col items-center">
                    <p className="font-mono text-[11px] md:text-[13px] tracking-[0.4em] text-[#00E5FF] mb-4 uppercase drop-shadow-md">
                        04 // The Data Cosmos
                    </p>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#F5F0E8] tracking-tighter mb-6 leading-[0.9]" style={{ fontFamily: '"Syne", sans-serif' }}>
                        Production <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7B5EA7]">Systems.</span>
                    </h2>
                </div>

                {/* ── FEATURED PROJECTS (2x2 GRID) ──────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-32" style={{ perspective: '1200px' }}>
                    {featuredProjects.map((project, idx) => (
                        <div
                            key={idx}
                            ref={(el) => { cardsRef.current[idx] = el; }}
                            className="w-full transform-style-3d transition-transform duration-500 hover:!-translate-y-4 will-change-transform transform-gpu"
                            aria-label={`Featured Project: ${project.title}`}
                        >
                            <div
                                className="group relative p-8 md:p-10 rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col justify-between will-change-transform transform-gpu"
                                style={{
                                    background: 'rgba(13, 13, 16, 0.65)',
                                    backdropFilter: 'blur(16px)',
                                    border: `1px solid ${project.accent}40`,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 0 1px ${project.accent}80, 0 20px 60px ${project.accent}20`; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)'; }}
                            >
                                <div>
                                    <div
                                        className="inline-block px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] font-bold mb-6 rounded-sm uppercase"
                                        style={{ color: project.accent, backgroundColor: `${project.accent}15` }}
                                    >
                                        [ {project.chip} ]
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-[#F5F0E8] tracking-tight mb-4" style={{ fontFamily: '"Syne", sans-serif' }}>
                                        {project.title}
                                    </h3>
                                    <p className="font-mono text-[13px] leading-[1.9] text-[#F5F0E8]/70 mb-8 max-w-lg">
                                        {project.description}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.metrics.map((metric, mIdx) => (
                                            <span key={mIdx} className="font-mono text-[9px] md:text-[10px] tracking-widest text-[#F5F0E8]/50 uppercase border border-white/10 px-2.5 py-1">
                                                [ {metric} ]
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-6 border-t border-white/10 pt-6">
                                        {project.liveDemo && (
                                            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="group/btn flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#00E5FF] hover:text-white transition-colors">
                                                [ VIEW LIVE
                                                <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> ]
                                            </a>
                                        )}
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="group/btn flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#7B5EA7] hover:text-white transition-colors">
                                                [ GITHUB
                                                <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> ]
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── THE ARCHIVE (BRUTALIST LIST) ──────────────────────────────── */}
                <div ref={archiveRef} className="w-full max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-8 tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
                        // The Archive
                    </h3>
                    <div className="flex flex-col border-t border-white/10">
                        {archiveProjects.map((proj, idx) => (
                            <a
                                key={idx}
                                href={proj.link}
                                target="_blank" rel="noopener noreferrer"
                                className="group flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors px-4 -mx-4 rounded-lg"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 mb-2 md:mb-0">
                                    <span className="text-[#F5F0E8] font-bold text-lg" style={{ fontFamily: '"Syne", sans-serif' }}>{proj.title}</span>
                                    <span className="font-mono text-[11px] text-[#00E5FF] tracking-widest uppercase hidden md:block">{proj.type}</span>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <span className="font-mono text-[11px] text-white/40 tracking-wider">{proj.tech}</span>
                                    <svg className="w-4 h-4 text-white/20 group-hover:text-[#7B5EA7] transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            </div>

        </section>
    );
}