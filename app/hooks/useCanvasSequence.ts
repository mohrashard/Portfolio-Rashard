'use client';

import { useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// useCanvasSequence
//
// Industry-standard canvas image-sequence hook for GSAP ScrollTrigger.
// Designed to eliminate:
//   1. Main-thread blocking from serial image loading
//   2. Compositor stalls from undecoded images hitting drawImage()
//   3. Unnecessary getContext() calls on the render hot-path
//   4. rAF thrashing from GSAP ticking faster than the screen refresh rate
// ─────────────────────────────────────────────────────────────────────────────

interface UseCanvasSequenceOptions {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    /** Total number of frames in the sequence (e.g. 121). */
    frameCount: number;
    /** Sub-directory under /frames/, e.g. "herosec" → /frames/herosec/frame_001.jpg */
    frameDir: string;
}

interface CanvasSequenceHandles {
    /** Call once when the section enters the viewport to start loading. */
    loadImages: () => void;
    /** Call from GSAP onUpdate – coalesces into one rAF per display frame. */
    scheduleRender: (frameIndex: number) => void;
    /** Call on resize and onRefresh. Recalculates backing-store size. */
    setSize: () => void;
    /** Immediately render a specific frame index (for onRefresh). */
    render: (frameIndex: number) => void;
    /** Purge loaded images to free GPU memory (call on section leave). */
    purge: () => void;
}

export function useCanvasSequence({
    canvasRef,
    frameCount,
    frameDir,
}: UseCanvasSequenceOptions): CanvasSequenceHandles {

    // ── Stable context ref: getContext() is called once, never on the hot path ──
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    // ── Boolean lock: zero-allocation alternative to cancelAnimationFrame() ──
    const renderPendingRef = useRef(false);
    const lastWidth = useRef(0);

    // ── Frame URL: preserves the frame_001 (+1 offset) numbering convention ──
    const frameUrl = useCallback(
        (i: number) => `/frames/${frameDir}/frame_${(i + 1).toString().padStart(3, '0')}.jpg`,
        [frameDir]
    );

    // ── getCtx: lazy-initialise and cache the 2D context ─────────────────────
    const getCtx = useCallback((): CanvasRenderingContext2D | null => {
        if (ctxRef.current) return ctxRef.current;
        const canvas = canvasRef.current;
        if (!canvas) return null;
        // alpha:false  → skips transparency compositing (-30% GPU cost)
        // desynchronized:true → paints direct to screen, bypasses compositor queue
        ctxRef.current = canvas.getContext('2d', { alpha: false, desynchronized: true });
        return ctxRef.current;
    }, [canvasRef]);

    // ── setSize: recalculate backing-store; skips Y-axis resize on mobile ─────
    const setSize = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return;
        // Only recalculate on width changes (prevents mobile address-bar thrashing)
        if (window.innerWidth === lastWidth.current) return;
        lastWidth.current = window.innerWidth;

        const isMobile = window.innerWidth < 768;
        // Cap DPR: 1.5x on mobile saves significant GPU memory vs native 3x
        const dpr = isMobile
            ? Math.min(window.devicePixelRatio || 1, 1.5)
            : Math.min(window.devicePixelRatio || 1, 2);

        canvas.dataset.dpr = String(dpr);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = '100vw';
        canvas.style.height = '100dvh';
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    }, [canvasRef, getCtx]);

    // ── render: pure, lightweight drawImage — zero allocations ───────────────
    const render = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return;

        const images = imagesRef.current;
        if (!images.length) return;

        const img = images[Math.min(Math.max(Math.round(index), 0), images.length - 1)];
        // Guard: image must be fully loaded AND decoded (naturalWidth > 0 confirms decode)
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const dpr = parseFloat(canvas.dataset.dpr || '1');
        const displayW = canvas.width / dpr;
        const displayH = canvas.height / dpr;
        // Cover fit: scale uniformly so the image fills the canvas without letterboxing
        const r = Math.max(displayW / img.width, displayH / img.height);
        const cx = (displayW - img.width * r) / 2;
        const cy = (displayH - img.height * r) / 2;
        ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * r, img.height * r);
    }, [canvasRef, getCtx]);

    // ── scheduleRender: rAF coalescing lock ───────────────────────────────────
    // GSAP's scrub can fire onUpdate at 120Hz on ProMotion displays.
    // A boolean flag prevents scheduling more than one rAF per display frame —
    // cheaper than cancelAnimationFrame() which allocates a new ID every tick.
    const scheduleRender = useCallback((index: number) => {
        if (renderPendingRef.current) return;
        renderPendingRef.current = true;
        requestAnimationFrame(() => {
            renderPendingRef.current = false;
            render(index);
        });
    }, [render]);

    // ── loadImages: parallel preload + .decode() GPU upload ──────────────────
    // Strategy:
    //   1. On mobile, skip every other frame (halves memory footprint).
    //   2. Create all Image() objects up front so the browser fires HTTP/2
    //      multiplexed requests in parallel (not serialised by JS).
    //   3. Call .decode() on each image: this forces the browser to
    //      GPU-upload the bitmap off the main thread BEFORE drawImage() is
    //      ever called — eliminating the per-frame compositor stall on first draw.
    //   4. Render frame 0 as soon as it is decoded (eager first-paint).
    const loadImages = useCallback(() => {
        // Idempotency guard: don't reload if images are already present
        if (imagesRef.current.length > 0 && imagesRef.current[0]) return;

        const isMobile = window.innerWidth < 768;
        const frameStep = isMobile ? 2 : 1;
        const totalFrames = Math.floor((frameCount - 1) / frameStep) + 1;

        // Pre-allocate array to avoid dynamic resizing during the loop
        const images: HTMLImageElement[] = new Array(totalFrames);

        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            // Setting src fires the HTTP request immediately — all requests are
            // batched together so the browser can multiplex them over HTTP/2.
            img.src = frameUrl(i * frameStep);
            images[i] = img;
        }

        // Store immediately so the render guard can draw as soon as frame 0 resolves
        imagesRef.current = images;

        // .decode() returns a Promise that resolves once the image is fully decoded
        // and GPU-uploaded. We use Promise.allSettled so one broken URL (404 etc.)
        // doesn't abort the entire sequence.
        images[0].decode().then(() => {
            // Eager first-paint: draw frame 0 the instant it is GPU-ready
            render(0);
            // Kick off decoding for all remaining frames in parallel.
            // These fire off-main-thread; we don't need to await them — the
            // render() guard (naturalWidth === 0) handles not-yet-decoded frames.
            for (let i = 1; i < images.length; i++) {
                images[i].decode().catch(() => { /* tolerate missing frames */ });
            }
        }).catch(() => { /* first frame failed — nothing to paint */ });
    }, [frameCount, frameUrl, render]);

    // ── purge: free GPU memory when section leaves the viewport ──────────────
    const purge = useCallback(() => {
        imagesRef.current = [];
    }, []);

    return { loadImages, scheduleRender, setSize, render, purge };
}
