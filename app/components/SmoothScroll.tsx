'use client';

import { ReactNode, useEffect } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

function LenisScrollTriggerSync() {
    useLenis(ScrollTrigger.update);
    return null;
}

interface SmoothScrollProps {
    children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lenisOptions: any = {
    lerp: 0.07,
    duration: 1.5,
    smoothTouch: false,
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
    useEffect(() => {
        // Ensure ScrollTrigger refreshes after Lenis takes over the scroll
        ScrollTrigger.refresh();
    }, []);

    return (
        <ReactLenis root options={lenisOptions}>
            <LenisScrollTriggerSync />
            {children as any}
        </ReactLenis>
    );
}
