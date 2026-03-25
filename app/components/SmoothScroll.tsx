'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
    children: ReactNode;
}

// lerp: 0.12 = snappy but smooth. 0.07 was so slow the page felt frozen.
// Removed `duration` — lerp and duration conflict; use only lerp for GSAP sync.
// smoothTouch: false = hands native touch physics to iOS/Android (no double-interpolation).
const lenisOptions = {
    lerp: 0.12,
    smoothTouch: false,
};

// LenisRef is typed as { lenis: Lenis | undefined } by @studio-freight/react-lenis.
type LenisRef = { lenis: { raf: (time: number) => void } | undefined };

export default function SmoothScroll({ children }: SmoothScrollProps) {
    const lenisRef = useRef<LenisRef | null>(null);

    useEffect(() => {
        // Single GSAP ticker subscriber that fires at GSAP's own tick rate.
        // This replaces useLenis(ScrollTrigger.update) which was firing ScrollTrigger
        // updates on EVERY rAF — even frames where the scroll position didn't change.
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
            // CRITICAL: tell ScrollTrigger the new lerp-smoothed scroll position that
            // Lenis just calculated. Without this, ScrollTrigger reads stale native scroll
            // values while Lenis has already moved ahead — canvas frames freeze mid-scroll.
            ScrollTrigger.update();
        }

        gsap.ticker.add(update);
        // Disable GSAP lag smoothing so Lenis gets clean, accurate timestamps
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        // autoRaf={false} — we drive Lenis from the GSAP ticker above, not its own rAF loop.
        // This prevents two competing animation loops running simultaneously.
        <ReactLenis root options={lenisOptions} ref={lenisRef as any} autoRaf={false}>
            {children as any}
        </ReactLenis>
    );
}
