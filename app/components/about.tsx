'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const ABOUT_FRAME_COUNT = 121;

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // UI Refs for precise scroll-linked animation
    const headerRef = useRef<HTMLHeadingElement>(null);
    const block1Ref = useRef<HTMLDivElement>(null);
    const block2Ref = useRef<HTMLDivElement>(null);
    const block3Ref = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    const imagesRef = useRef<HTMLImageElement[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let ctx: gsap.Context;
        const seq = { frame: 0 };
        const currentFrame = (i: number) => `/frames/about/frame_${i.toString().padStart(3, '0')}.jpg`;

        const render = (index: number) => {
            const canvas = canvasRef.current;
            // ── APPLE-TIER CONTEXT: alpha:false + desynchronized:true
            const context = canvas?.getContext('2d', { alpha: false, desynchronized: true });
            if (!canvas || !context) return;

            const img = imagesRef.current[Math.round(index)];
            if (!img || !img.complete || img.naturalWidth === 0) return;
            const dpr = parseFloat(canvas.dataset.dpr || '1');
            const displayW = canvas.width / dpr;
            const displayH = canvas.height / dpr;
            const r = Math.max(displayW / img.width, displayH / img.height);
            const cx = (displayW - img.width * r) / 2;
            const cy = (displayH - img.height * r) / 2;
            context.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * r, img.height * r);
        };

        let lastWidth = 0;
        const setSize = () => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d', { alpha: false, desynchronized: true });
            if (!canvas || !context) return;
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            const isMobileView = window.innerWidth < 768;
            const dpr = isMobileView
                ? Math.min(window.devicePixelRatio || 1, 1.5)
                : Math.min(window.devicePixelRatio || 1, 2);
            canvas.dataset.dpr = String(dpr);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = '100vw';
            canvas.style.height = '100dvh';
            context.scale(dpr, dpr);
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
        };

        // ── 2. GSAP CONTEXT ──────────────────────────────────────────────
        ctx = gsap.context(() => {
            setSize();

            const isMobile = window.innerWidth < 768;
            const frameStep = isMobile ? 2 : 1;
            const totalFrames = Math.floor((ABOUT_FRAME_COUNT - 1) / frameStep) + 1;

            const loadImages = () => {
                if (imagesRef.current[0]) return;

                // Pre-allocate array to totalFrames length to prevent index-based race condition
                imagesRef.current = new Array(totalFrames);

                const firstImg = new Image();
                firstImg.src = currentFrame(0);
                firstImg.onload = () => {
                    imagesRef.current[0] = firstImg;
                    render(0);

                    const scheduleIdleDecode = (i: number) => {
                        if (i >= totalFrames) return;
                        const decode = () => {
                            const img = new Image();
                            img.src = currentFrame(i * frameStep);
                            imagesRef.current[i] = img;
                            img.decode().catch(() => {}).finally(() => scheduleIdleDecode(i + 1));
                        };
                        if ('requestIdleCallback' in window) {
                            requestIdleCallback(decode, { timeout: 300 });
                        } else {
                            setTimeout(decode, 0);
                        }
                    };
                    scheduleIdleDecode(1);
                };
            };

            // ── 1. JUST-IN-TIME LOADING VIA SCROLLTRIGGER ──────────────────
            ScrollTrigger.create({
                trigger: container,
                start: "top bottom+=1000px",
                end: "bottom top-=1000px",
                onEnter: loadImages,
                onEnterBack: loadImages,
                onLeave: () => { imagesRef.current = []; },
                onLeaveBack: () => { imagesRef.current = []; }
            });

            const tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: '+=4000',
                    scrub: 1.5,
                    pin: true,
                    onRefresh: () => render(seq.frame)
                }
            });

            // ── rAF-batched render: prevents GSAP firing faster than screen refresh rate
            let renderId: number;
            tl2.to(seq, { frame: totalFrames - 1, snap: 'frame', ease: 'none', duration: 10, onUpdate: () => {
                if (renderId) cancelAnimationFrame(renderId);
                renderId = requestAnimationFrame(() => render(seq.frame));
            } }, 0);

            tl2.fromTo(headerRef.current, { opacity: 0, y: 30, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }, 0.5);
            tl2.fromTo(block1Ref.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }, 2.0);
            tl2.fromTo(block2Ref.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }, 4.0);
            tl2.fromTo(block3Ref.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }, 6.0);
            tl2.fromTo(btnRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }, 8.0);

            const handleResize = () => { setSize(); render(seq.frame); };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, container);

        return () => {
            ctx.revert();
            imagesRef.current = [];
        };
    }, []);

    return (
        <section ref={containerRef} id="about" className="relative w-full h-screen bg-[#060608] overflow-hidden">

            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full object-cover" 
                aria-label="Cinematic data-stream background animation"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#060608]/90 to-[#060608] pointer-events-none z-10" />

            <div className="absolute inset-0 z-20 flex w-full h-full pointer-events-none">
                <div className="hidden lg:block w-1/2 h-full" />

                <div className="w-full lg:w-1/2 h-full flex flex-col justify-center p-6 md:p-10 lg:pr-16">
                    <div className="max-w-xl pointer-events-auto">

                        {/* THE HEADER */}
                        <h2
                            ref={headerRef}
                            className="font-black leading-[1.05] tracking-tighter mb-6 drop-shadow-2xl"
                            aria-label="Philosophy: I build systems that think."
                            style={{
                                fontFamily: '"Syne", sans-serif',
                                fontSize: 'clamp(32px, 4vw, 52px)', // Scaled down to fit perfectly
                                color: '#FFFFFF'
                            }}
                        >
                            I build systems <br /> that{' '}
                            <span
                                style={{
                                    backgroundImage: 'linear-gradient(to right, #00E5FF, #a78bfa)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                think.
                            </span>
                        </h2>

                        {/* THE NARRATIVE BLOCKS */}
                        <div className="flex flex-col gap-5 mb-8">

                            {/* Block 1 */}
                            <div ref={block1Ref} className="flex items-start gap-4 opacity-0">
                                <div className="mt-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(0,229,255,0.15)] flex-shrink-0 backdrop-blur-md will-change-transform transform-gpu">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                        <polyline points="2 17 12 22 22 17"></polyline>
                                        <polyline points="2 12 12 17 22 12"></polyline>
                                    </svg>
                                </div>
                                <div aria-label="Professional Foundation">
                                    <h3 className="font-bold text-white text-base md:text-lg tracking-tight mb-1" style={{ fontFamily: '"Syne", sans-serif' }}>Rigorous Foundation</h3>
                                    <p className="font-mono text-[12px] md:text-[13px] leading-relaxed text-[#F5F0E8]/60">
                                        A <span className="text-[#00E5FF]">Remote AI Architect</span> based in <span className="text-[#00E5FF]">Colombo, Sri Lanka</span>. Graduating with First-Class Honors in Software Engineering, my methodology is built on high-performance system architecture.
                                    </p>
                                </div>
                            </div>

                            {/* Block 2 */}
                            <div ref={block2Ref} className="flex items-start gap-4 opacity-0">
                                <div className="mt-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(167,139,250,0.15)] flex-shrink-0 backdrop-blur-md will-change-transform transform-gpu">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base md:text-lg tracking-tight mb-1" style={{ fontFamily: '"Syne", sans-serif' }}>Autonomous Logic</h3>
                                    <p className="font-mono text-[12px] md:text-[13px] leading-relaxed text-[#F5F0E8]/60">
                                        I don{"'"}t just integrate APIs; I engineer intelligent pipelines. From deploying scalable Next.js ecosystems to training custom models, I exist at the intersection of raw data and execution.
                                    </p>
                                </div>
                            </div>

                            {/* Block 3 */}
                            <div ref={block3Ref} className="flex items-start gap-4 opacity-0">
                                <div className="mt-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] flex-shrink-0 backdrop-blur-md will-change-transform transform-gpu">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="4 17 10 11 4 5"></polyline>
                                        <line x1="12" y1="19" x2="20" y2="19"></line>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base md:text-lg tracking-tight mb-1" style={{ fontFamily: '"Syne", sans-serif' }}>Code as Material</h3>
                                    <p className="font-mono text-[12px] md:text-[13px] leading-relaxed text-[#F5F0E8]/60">
                                        To me, code is a tangible material. When structured with extreme precision, it stops being a mere script and becomes a <span className="text-[#a78bfa]">silicon consciousness</span>. That is the standard I build to.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* THE BUTTON */}
                        <div ref={btnRef} className="opacity-0">
                            <button className="group relative px-8 py-3.5 bg-[#060608] text-[#00E5FF] font-mono text-[12px] font-bold tracking-[0.2em] border border-[#00E5FF]/40 rounded-full hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                                <span className="relative z-10 flex items-center gap-3">
                                    VIEW RÉSUMÉ
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}