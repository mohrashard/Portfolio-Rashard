'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { useCanvasSequence } from '../hooks/useCanvasSequence';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText);
}

const FRAME_COUNT = 121;

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const coreIdentityRef = useRef<HTMLDivElement>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    const firstNameRef = useRef<HTMLSpanElement>(null);
    const middleNameRef = useRef<HTMLSpanElement>(null);
    const lastNameRef = useRef<HTMLSpanElement>(null);
    const roleRef = useRef<HTMLParagraphElement>(null);

    const { loadImages, scheduleRender, setSize, render, purge } = useCanvasSequence({
        canvasRef,
        frameCount: FRAME_COUNT,
        frameDir: 'herosec',
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let ctx: gsap.Context;
        // seq.frame is a plain number that GSAP tweens; the hook converts it to an index
        const seq = { frame: 0 };
        const isMobile = window.innerWidth < 768;
        const frameStep = isMobile ? 2 : 1;
        const totalFrames = Math.floor((FRAME_COUNT - 1) / frameStep) + 1;

        // ── GSAP CONTEXT ─────────────────────────────────────────────────
        ctx = gsap.context(() => {
            setSize();

            const splitFirst = firstNameRef.current ? new SplitText(firstNameRef.current, { type: 'chars' }) : null;
            const splitMiddle = middleNameRef.current ? new SplitText(middleNameRef.current, { type: 'chars' }) : null;
            const splitLast = lastNameRef.current ? new SplitText(lastNameRef.current, { type: 'chars' }) : null;

            const allNameChars = [
                ...(splitFirst?.chars || []),
                ...(splitMiddle?.chars || []),
                ...(splitLast?.chars || [])
            ];

            const entranceTL = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } });
            entranceTL
                .fromTo(
                    allNameChars,
                    { opacity: 0, y: 60 },
                    { opacity: 1, y: 0, stagger: 0.03 }
                )
                .fromTo(
                    roleRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0 },
                    '-=1.0'
                );

            // ── LIFECYCLE TRIGGER ────────────────────────────────────────────────
            // Manages aggressive preload and delayed purge. By placing purge 3000px 
            // outside the visual boundary, we prevent lag when the user scrolls back 
            // and forth across the exact boundary of the section.
            ScrollTrigger.create({
                trigger: container,
                start: 'top bottom+=3000',
                end: 'bottom+=4500 top-=3000', // Account for the 4500px pin duration so backwards scroll preloads correctly
                onEnter: loadImages,
                onEnterBack: loadImages,
                onLeave: purge,
                onLeaveBack: purge,
            });

            const masterTL = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: '+=4500',
                    // On mobile, native touch inertia is already perfectly smooth. Adding JS scrub delay
                    // on top creates input lag. `true` locks the frame exactly to the physical finger.
                    scrub: isMobile ? true : 0.8,
                    pin: true,
                    // Load/purge is handled by the Lifecycle Trigger above to provide a 3000px safe zone
                    onRefresh: () => render(seq.frame)
                },
            });

            // ── rAF-coalesced render ────────────────────────────────────────
            masterTL.to(
                seq,
                {
                    frame: totalFrames - 1,
                    snap: 'frame',
                    ease: 'none',
                    duration: 10,
                    onUpdate: () => scheduleRender(() => seq.frame),
                },
                0
            );

            masterTL.to(
                coreIdentityRef.current,
                { y: -120, opacity: 0, duration: 2.5, ease: 'power3.out' },
                1.0
            );

            const summaryItems = summaryRef.current?.querySelectorAll('.summary-item');
            if (summaryItems && summaryItems.length > 0) {
                masterTL.fromTo(
                    Array.from(summaryItems),
                    { opacity: 0, y: 70 },
                    { opacity: 1, y: 0, stagger: 0.8, duration: 1.5, ease: 'power3.out' },
                    3.5
                );
                masterTL.to(
                    Array.from(summaryItems),
                    { opacity: 0, y: -70, stagger: 0.2, duration: 1.0, ease: 'power3.out' },
                    6.0
                );
            }

            masterTL.fromTo(
                statsRef.current,
                { opacity: 0, scale: 0.96, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'power3.out' },
                7.0
            );
            masterTL.to(
                statsRef.current,
                { opacity: 0, y: -50, duration: 1.0, ease: 'power3.out' },
                9.0
            );

            const onMouseMove = (e: MouseEvent) => {
                const xP = e.clientX / window.innerWidth - 0.5;
                const yP = e.clientY / window.innerHeight - 0.5;
                gsap.to(coreIdentityRef.current, { x: xP * 25, y: yP * 25, duration: 1.2, ease: 'power3.out' });
            };
            window.addEventListener('mousemove', onMouseMove);

            const handleResize = () => {
                setSize();
                render(seq.frame);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('resize', handleResize);
            };
        }, container);

        return () => {
            ctx.revert();
            purge();
        };
    }, [loadImages, scheduleRender, setSize, render, purge]);

    return (
        <section ref={containerRef} id="home" className="relative w-full h-screen overflow-hidden bg-[#060608]">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                aria-label="Interactive 3D cinematic background animation"
            />

            {/* Cinematic Overlays */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(6,6,8,0.4)_0%,rgba(6,6,8,0.7)_60%,rgba(6,6,8,0.95)_100%)]" />

            {/* Grain (Hidden on mobile to save entire screen opacity blending calc) */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-[0.035] hidden md:block"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* ── Layer 1: Core Identity ───────────────────────────────── */}
            <div
                ref={coreIdentityRef}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 w-full"
            >
                <h1 className="font-black leading-[0.9] tracking-tighter uppercase text-white drop-shadow-2xl mb-2">
                    <span
                        ref={firstNameRef}
                        className="inline-block whitespace-nowrap"
                        style={{
                            fontFamily: '"Syne", sans-serif',
                            fontSize: 'clamp(32px, 9vw, 110px)',
                            textShadow: '0 4px 40px rgba(0,0,0,0.8)',
                        }}
                    >
                        Mohamed
                    </span>
                    <div className="font-bold leading-[1.1] tracking-tighter uppercase mt-2 flex flex-wrap justify-center items-center gap-x-3 md:gap-x-6 drop-shadow-2xl translate-y-[-0.1em]">
                        <span
                            ref={middleNameRef}
                            className="text-[#00E5FF] whitespace-nowrap"
                            style={{
                                fontFamily: '"Syne", sans-serif',
                                fontSize: 'clamp(24px, 7vw, 85px)',
                                textShadow: '0 0 30px rgba(0,229,255,0.4)',
                            }}
                        >
                            Rashard
                        </span>
                        <span
                            ref={lastNameRef}
                            className="text-white whitespace-nowrap"
                            style={{
                                fontFamily: '"Syne", sans-serif',
                                fontSize: 'clamp(24px, 7vw, 85px)',
                                textShadow: '0 4px 40px rgba(0,0,0,0.8)',
                            }}
                        >
                            Rizmi
                        </span>
                    </div>
                </h1>

                <div aria-hidden="true" className="w-20 h-[1px] bg-[#00E5FF]/70 mb-8 shadow-[0_0_15px_rgba(0,229,255,0.6)]" />

                <p
                    ref={roleRef}
                    className="font-mono tracking-[0.3em] uppercase"
                    aria-label="Current Role: AI and Full-Stack Architect"
                    style={{
                        fontSize: 'clamp(11px, 1.3vw, 16px)',
                        color: '#ffffff',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '10px 24px',
                        borderRadius: '100px',
                        border: '1px solid rgba(0,229,255,0.3)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}
                >
                    AI &amp; Full-Stack Architect
                </p>
            </div>

            {/* ── Layer 2: Narrative Summary ───────────────────────────── */}
            <div
                ref={summaryRef}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-6 text-center"
                style={{ maxWidth: '860px', margin: '0 auto', left: 0, right: 0 }}
            >
                <div className="summary-item mb-10 opacity-0">
                    <h3
                        className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
                        style={{ color: '#00E5FF' }}
                    >
                        Philosophy
                    </h3>
                    <p
                        className="font-black leading-[1.1] tracking-tight"
                        style={{
                            fontFamily: '"Syne", sans-serif',
                            fontSize: 'clamp(24px, 4.5vw, 52px)',
                            color: '#FFFFFF',
                            textShadow: '0 2px 30px rgba(0,0,0,0.8)',
                        }}
                    >
                        Architecting{' '}
                        <span
                            style={{
                                backgroundImage: 'linear-gradient(to right, #00E5FF, #a78bfa)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Intelligence
                        </span>{' '}
                        through High-Performance Neural Code.
                    </p>
                </div>

                <div
                    className="summary-item opacity-0 p-8 md:p-10 rounded-3xl max-w-2xl will-change-transform transform-gpu backdrop-blur-none bg-[#060608]/95 md:bg-[rgba(6,6,8,0.75)] md:backdrop-blur-2xl"
                    style={{
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 8px 60px rgba(0,0,0,0.6)',
                    }}
                >
                    <p
                        className="leading-relaxed font-light"
                        style={{
                            fontSize: 'clamp(14px, 1.6vw, 19px)',
                            color: '#E8E3D8',
                        }}
                    >
                        Software Engineer with a{' '}
                        <span style={{ color: '#00E5FF', fontWeight: 500 }}>First-Class Honors</span>{' '}
                        foundation. Specialized in{' '}
                        <span style={{ color: '#00E5FF', fontWeight: 500 }}>Next.js 15</span>,{' '}
                        <span style={{ color: '#a78bfa', fontWeight: 500 }}>FastAPI</span>, and{' '}
                        <span style={{ color: '#00E5FF', fontWeight: 500 }}>ML architectures</span>.
                        Proven track record of building autonomous, end-to-end SaaS ecosystems.
                    </p>
                </div>
            </div>

            {/* ── Layer 3: Stats & Experience ─────────────────────────── */}
            <div
                ref={statsRef}
                className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none px-6 opacity-0"
            >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl w-full">
                    <div
                        className="lg:col-span-3 p-8 md:p-10 rounded-3xl flex flex-col justify-center will-change-transform transform-gpu backdrop-blur-none bg-[#060608]/95 md:bg-[rgba(6,6,8,0.80)] md:backdrop-blur-2xl"
                        style={{
                            border: '1px solid rgba(255,255,255,0.10)',
                            boxShadow: '0 8px 60px rgba(0,0,0,0.6)',
                        }}
                    >
                        <h4
                            className="font-mono text-[10px] tracking-[0.4em] mb-5 uppercase"
                            style={{ color: '#00E5FF' }}
                        >
                            Active Role
                        </h4>
                        <div className="space-y-2">
                            <div
                                className="font-bold tracking-tight"
                                style={{ fontSize: 'clamp(22px,2.8vw,32px)', color: '#FFFFFF' }}
                            >
                                Founder &amp; Lead Engineer
                            </div>
                            <div
                                className="font-mono text-sm tracking-wider"
                                style={{ color: '#a78bfa' }}
                            >
                                Independant // 2026 – Present
                            </div>
                            <p
                                className="text-sm leading-relaxed mt-4 max-w-md"
                                style={{ color: 'rgba(255,255,255,0.55)' }}
                            >
                                Pioneering AI solutions, delivering custom ecosystems that reduce operational
                                overhead by 25% with 99.9% uptime.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {[
                            { val: '1st', label: 'CLASS HONS' },
                            { val: 'v15', label: 'NEXT.JS' },
                            { val: 'AI/ML', label: 'RESEARCH' },
                            { val: 'Agile', label: 'WORKFLOW' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-5 rounded-2xl flex flex-col justify-center items-center text-center will-change-transform transform-gpu backdrop-blur-none bg-[#060608]/95 md:bg-[rgba(6,6,8,0.70)] md:backdrop-blur-xl"
                                style={{
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <div
                                    className="font-black"
                                    style={{ fontSize: 'clamp(18px,2vw,24px)', color: '#00E5FF' }}
                                >
                                    {stat.val}
                                </div>
                                <div
                                    className="font-mono mt-2 uppercase"
                                    style={{ fontSize: '8px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.40)' }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}