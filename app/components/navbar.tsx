'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    // ── 1. SCROLL SPY & ISLAND LOGIC ─────────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => {
            // Trigger the Dynamic Island when scrolled past 50px
            setIsScrolled(window.scrollY > 50);

            // Scroll Spy Logic
            const sections = ["home", "about", "skills", "projects", "contact"];
            // Offset by a third of the screen so it triggers naturally as you read
            const scrollPos = window.scrollY + window.innerHeight / 3;

            let current = "home";
            for (let i = sections.length - 1; i >= 0; i--) {
                const element = document.getElementById(sections[i]);
                if (element) {
                    // Ignore the aggressive early preload triggers which start 3000px early
                    const st = ScrollTrigger.getAll().find(t => t.trigger === element && String(t.vars.start).indexOf('bottom+=3000') === -1);
                    const targetTop = st ? st.start : element.offsetTop;

                    if (targetTop <= scrollPos) {
                        current = sections[i];
                        break;
                    }
                }
            }
            if (current !== activeSection) {
                setActiveSection(current);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeSection]);

    // ── 2. SMOOTH SCROLL ROUTER ──────────────────────────────────────────────
    const scrollToSection = (id: string) => {
        setIsMenuOpen(false);
        if (pathname !== "/") {
            router.push(`/#${id}`);
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            // GSAP ScrollTrigger aware positioning. Ignore early preload triggers.
            const st = ScrollTrigger.getAll().find(t => t.trigger === element && String(t.vars.start).indexOf('bottom+=3000') === -1);
            const offsetPosition = st ? st.start : element.offsetTop - 100;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSection(id);
        }
    };

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isMenuOpen]);

    const navItems = ["home", "about", "skills", "projects", "contact"];

    return (
        <>
            {/* ── THE DYNAMIC ISLAND HEADER ─────────────────────────────────────── */}
            <header
                className={`fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
                    ? 'py-4 md:py-6 pointer-events-none' // Unlocks edges for clicking things behind it
                    : 'py-8 px-6 md:px-12'
                    }`}
            >
                <div
                    className={`flex justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto ${isScrolled
                        ? 'w-[90%] md:w-[75%] lg:w-[60%] max-w-4xl backdrop-blur-none bg-[#060608]/98 md:bg-[rgba(6,6,8,0.7)] md:backdrop-blur-2xl border border-white/5 md:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-full px-6 md:px-8 py-3.5 will-change-transform transform-gpu'
                        : 'w-full max-w-7xl bg-transparent border-transparent px-0 py-0'
                        }`}
                >
                    {/* Logo */}
                    <div
                        onClick={() => scrollToSection("home")}
                        className="cursor-pointer group flex items-center gap-1.5"
                    >
                        <span className="text-xl md:text-2xl font-black text-[#F5F0E8] tracking-tighter" style={{ fontFamily: '"Syne", sans-serif' }}>
                            M<span className="text-[#00E5FF] transition-colors duration-300 group-hover:text-[#7B5EA7]">r²</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item)}
                                className={`relative group font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${activeSection === item ? 'text-white' : 'text-white/40 hover:text-[#00E5FF]'
                                    }`}
                            >
                                {item}
                                {/* Glowing Active Dot */}
                                <div
                                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00E5FF] transition-all duration-300 shadow-[0_0_8px_rgba(0,229,255,0.8)] ${activeSection === item ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100 group-hover:bg-white/50 group-hover:shadow-none'
                                        }`}
                                />
                            </button>
                        ))}
                    </nav>

                    {/* Mobile Menu Toggle (Brutalist Lines) */}
                    <button
                        className="md:hidden w-8 h-8 flex flex-col justify-center items-end gap-1.5 relative z-[101] group"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className={`h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6 group-hover:bg-[#00E5FF]'}`} />
                        <div className={`h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? 'w-0 opacity-0' : 'w-4 group-hover:bg-[#00E5FF]'}`} />
                        <div className={`h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-5 group-hover:bg-[#00E5FF]'}`} />
                    </button>
                </div>
            </header>

            {/* ── FULLSCREEN CINEMATIC MOBILE OVERLAY ───────────────────────────── */}
            <div
                className={`fixed inset-0 z-[99] bg-[#060608] flex flex-col justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto clip-path-open' : 'opacity-0 pointer-events-none clip-path-closed'
                    }`}
            >
                {/* Background Noise/Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,rgba(6,6,8,1)_100%)] pointer-events-none" />

                <div className="flex flex-col items-center gap-6 z-10 w-full px-8">
                    {navItems.map((item, i) => (
                        <div key={item} className="w-full overflow-hidden flex justify-center">
                            <button
                                onClick={() => scrollToSection(item)}
                                className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                    } ${activeSection === item
                                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7B5EA7]'
                                        : 'text-[#F5F0E8] hover:text-[#00E5FF]'
                                    }`}
                                style={{
                                    fontFamily: '"Syne", sans-serif',
                                    transitionDelay: isMenuOpen ? `${i * 50}ms` : '0ms'
                                }}
                            >
                                {item}
                            </button>
                        </div>
                    ))}

                </div>

                {/* Footer details in mobile menu */}
                <div className={`absolute bottom-12 font-mono text-[9px] tracking-[0.4em] text-white/20 uppercase transition-all duration-500 ${isMenuOpen ? 'opacity-100 delay-500' : 'opacity-0'}`}>
                    MR² // 2026 // SYSTEM_ACTIVE
                </div>
            </div>
        </>
    );
}