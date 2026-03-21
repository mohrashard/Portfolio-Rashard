'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
    const [isComplete, setIsComplete] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const topDoorRef = useRef<HTMLDivElement>(null);
    const bottomDoorRef = useRef<HTMLDivElement>(null);
    
    // UI Refs
    const lineRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const percentParentRef = useRef<HTMLDivElement>(null);
    const percentRef = useRef<HTMLSpanElement>(null);
    const onlineRef = useRef<HTMLSpanElement>(null);
    
    useEffect(() => {
        // Lock scroll while preloader is active
        document.body.style.overflow = 'hidden';
        
        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = 'unset';
                setIsComplete(true);
            }
        });
        
        // ── PHASE 1: Terminal Uplink ──────────────────────────────────────────
        tl.to(lineRef.current, { 
            width: '250px', 
            duration: 1.5, 
            ease: 'expo.inOut' 
        });
        
        tl.to(textRef.current, {
            duration: 1.5,
            onUpdate: function() {
                const progress = this.progress();
                if (textRef.current) {
                    if (progress < 0.33) textRef.current.innerText = "INITIALIZING KERNEL...";
                    else if (progress < 0.66) textRef.current.innerText = "LOADING NEURAL WEIGHTS...";
                    else textRef.current.innerText = "ESTABLISHING CONNECTION...";
                }
            }
        }, "<");

        // Hide phase 1 slowly
        tl.to(textRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, ">");
        tl.to(lineRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' }, "<");
        
        // ── PHASE 2: The Count ────────────────────────────────────────────────
        tl.set(percentParentRef.current, { opacity: 1 });
        
        const counter = { val: 0 };
        tl.to(counter, {
            val: 100,
            duration: 2,
            ease: 'expo.inOut',
            onUpdate: () => {
                if (percentRef.current) {
                    percentRef.current.innerText = Math.round(counter.val).toString();
                }
            }
        });
        
        // ── PHASE 3: The Reveal ───────────────────────────────────────────────
        tl.set(percentRef.current, { innerText: '100' });
        tl.to(percentParentRef.current, { opacity: 0, duration: 0.1 }, "+=0.2");
        
        // System Online text reveal
        tl.set(onlineRef.current, { opacity: 1, color: '#7B5EA7', innerText: 'SYSTEM ONLINE' });
        tl.fromTo(onlineRef.current, 
            { scale: 0.9, filter: 'blur(10px)' }, 
            { scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.5)' }
        );
        
        // Fade out generic text
        tl.to(onlineRef.current, { opacity: 0, scale: 1.1, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' }, "+=0.5");
        
        // Blast doors split (reveal underneath)
        // Adjust durations slightly to snap snappily
        tl.to(topDoorRef.current, { y: '-100%', duration: 1.5, ease: 'expo.inOut' }, "+=0.1");
        tl.to(bottomDoorRef.current, { y: '100%', duration: 1.5, ease: 'expo.inOut' }, "<");
        
        return () => {
            tl.kill();
            document.body.style.overflow = 'unset'; // Fallback
        };
    }, []);
    
    if (isComplete) return null; // Unmount completely so interaction flows underneath
    
    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-auto flex items-center justify-center overflow-hidden">
            {/* The Sci-Fi Blast Doors */}
            <div ref={topDoorRef} className="absolute top-0 left-0 w-full h-1/2 bg-[#060608] will-change-transform transform-gpu z-10 
                border-b border-[#00E5FF]/5 shadow-[0_10px_40px_rgba(0,0,0,0.9)]" />
            <div ref={bottomDoorRef} className="absolute bottom-0 left-0 w-full h-1/2 bg-[#060608] will-change-transform transform-gpu z-10 
                border-t border-[#00E5FF]/5 shadow-[0_-10px_40px_rgba(0,0,0,0.9)]" />
            
            {/* The Cinematic Foreground Content Layer */}
            <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                
                {/* Phase 1: Terminal Line & Text */}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <p 
                        ref={textRef} 
                        className="font-mono text-[10px] md:text-xs text-[#00E5FF] tracking-[0.3em] uppercase mb-4 opacity-100 will-change-transform transform-gpu drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                        style={{ fontFamily: '"DM Mono", "Courier New", monospace' }}
                    >
                        &nbsp;
                    </p>
                    <div 
                        ref={lineRef} 
                        className="w-0 h-[1px] bg-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,1)] will-change-transform transform-gpu"
                    />
                </div>

                {/* Phase 2: Brutalist Percent Count */}
                <div ref={percentParentRef} className="absolute flex flex-row items-end opacity-0 pointer-events-none" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <span 
                        ref={percentRef} 
                        className="text-[#F5F0E8] font-black tracking-tighter leading-none will-change-transform transform-gpu"
                        style={{ fontFamily: '"Syne", sans-serif', fontSize: 'clamp(80px, 15vw, 200px)' }}
                    >
                        0
                    </span>
                    <span 
                        className="font-black text-[#00E5FF] leading-none mb-2 md:mb-6 tracking-tighter drop-shadow-[0_0_20px_rgba(0,229,255,0.4)] will-change-transform transform-gpu"
                        style={{ fontFamily: '"Syne", sans-serif', fontSize: 'clamp(30px, 5vw, 60px)' }}
                    >
                        %
                    </span>
                </div>

                {/* Phase 3: System Online */}
                <span 
                    ref={onlineRef}
                    className="absolute opacity-0 font-black tracking-tighter leading-none uppercase text-center w-full will-change-transform transform-gpu drop-shadow-[0_0_30px_rgba(123,94,167,0.5)]"
                    style={{ fontFamily: '"Syne", sans-serif', fontSize: 'clamp(40px, 8vw, 120px)', top: '50%', transform: 'translateY(-50%)' }}
                />
            </div>
        </div>
    );
}
