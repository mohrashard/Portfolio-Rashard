'use client';

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ── PERIODIC TABLE WITH OFFICIAL BRAND COLORS ──────────────────────────────
const SKILL_CATEGORIES = [
    {
        id: "01", title: "AI/ML & Audio", accent: "#00E5FF",
        skills: [
            { name: "TensorFlow", sym: "Tf", color: "#FF6F00" },
            { name: "Neural Nets", sym: "Nn", color: "#9932CC" },
            { name: "XGBoost", sym: "Xg", color: "#11A347" },
            { name: "Scikit-learn", sym: "Sk", color: "#F7931E" },
            { name: "Random Forest", sym: "Rf", color: "#228B22" },
            { name: "Gemini API", sym: "Gm", color: "#1A73E8" },
            { name: "Kokoro TTS", sym: "Kk", color: "#FF4081" },
            { name: "DeepFilter", sym: "Df", color: "#00BCD4" }
        ]
    },
    {
        id: "02", title: "Modern Web Stack", accent: "#7B5EA7",
        skills: [
            { name: "Next.js 15", sym: "Nx", color: "#FFFFFF" },
            { name: "React.js", sym: "Re", color: "#61DAFB" },
            { name: "Tailwind CSS", sym: "Tw", color: "#06B6D4" },
            { name: "Node.js", sym: "No", color: "#339933" },
            { name: "Express", sym: "Ex", color: "#FFFFFF" },
            { name: "FastAPI", sym: "Fa", color: "#009688" },
            { name: "Flask", sym: "Fl", color: "#FFFFFF" }
        ]
    },
    {
        id: "03", title: "Core Languages", accent: "#F5F0E8",
        skills: [
            { name: "Python", sym: "Py", color: "#3776AB" },
            { name: "TypeScript", sym: "Ts", color: "#3178C6" },
            { name: "JavaScript", sym: "Js", color: "#F7DF1E" },
            { name: "Java", sym: "Jv", color: "#007396" },
            { name: "C++", sym: "C+", color: "#00599C" },
            { name: "C#", sym: "C#", color: "#239120" },
            { name: "PHP", sym: "Ph", color: "#777BB4" }
        ]
    },
    {
        id: "04", title: "Databases & Cloud", accent: "#00E5FF",
        skills: [
            { name: "AWS", sym: "Aw", color: "#FF9900" },
            { name: "Vercel", sym: "Vc", color: "#FFFFFF" },
            { name: "Docker", sym: "Dk", color: "#2496ED" },
            { name: "PostgreSQL", sym: "Pg", color: "#336791" },
            { name: "MongoDB", sym: "Mg", color: "#47A248" },
            { name: "MySQL", sym: "My", color: "#4479A1" },
            { name: "Supabase", sym: "Sb", color: "#3ECF8E" },
            { name: "MSSQL", sym: "Ms", color: "#CC2927" }
        ]
    },
    {
        id: "05", title: "Enterprise Systems", accent: "#7B5EA7",
        skills: [
            { name: "ASP.NET", sym: "As", color: "#512BD4" },
            { name: "Java Servlet", sym: "Sv", color: "#28A1C5" },
            { name: "JWT Auth", sym: "Jw", color: "#FF00FF" },
            { name: "RBAC", sym: "Rb", color: "#607D8B" },
            { name: "AJAX", sym: "Aj", color: "#0055FF" }
        ]
    },
    {
        id: "06", title: "DevOps & Tooling", accent: "#F5F0E8",
        skills: [
            { name: "Linux", sym: "Lx", color: "#FCC624" },
            { name: "Git CI/CD", sym: "Gt", color: "#F05032" },
            { name: "Postman", sym: "Pm", color: "#FF6C37" },
            { name: "Hugging Face", sym: "Hf", color: "#FFD21E" },
            { name: "Jupyter", sym: "Jp", color: "#F37626" },
            { name: "VS Code", sym: "Vs", color: "#007ACC" }
        ]
    }
];

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIdx, setActiveIdx] = useState<number>(0);

    return (
        // ── MOBILE FIX: min-h-screen on mobile, locked h-screen on desktop ──
        <section ref={sectionRef} id="skills" className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-[#060608] relative overflow-hidden flex items-center justify-center p-4 md:p-8 lg:p-12 py-24 lg:py-0">

            <div className="absolute top-1/2 left-1/4 w-[60vh] h-[60vh] bg-[#00E5FF]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-[60vh] h-[60vh] bg-[#7B5EA7]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

            <div className="w-full h-full max-w-[1600px] mx-auto flex flex-col lg:flex-row relative z-10 gap-8 lg:gap-12">

                {/* ── LEFT SIDE: QUANTUM ANTI-GRAVITY STAGE ──────────────── */}
                {/* Fixed height on mobile so it doesn't crush the rest of the content */}
                <div className="w-full lg:w-[60%] h-[340px] md:h-[45vh] lg:h-full relative border border-white/5 bg-white/[0.01] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl shrink-0 mt-8 lg:mt-0">

                    <div
                        className="absolute inset-0 opacity-20 transition-colors duration-700 pointer-events-none"
                        style={{ background: `radial-gradient(circle at center, ${SKILL_CATEGORIES[activeIdx].accent}15 0%, transparent 60%)` }}
                    />

                    {/* The 3D VisionOS Nodes with Responsive Orbital Physics */}
                    <FloatingNodes
                        skills={SKILL_CATEGORIES[activeIdx].skills}
                    />

                    {/* HUD Corners */}
                    <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/10" />
                    <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/10" />
                    <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/10" />
                    <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/10" />
                </div>

                {/* ── RIGHT SIDE: BRUTALIST LIST ─────────── */}
                <div className="w-full lg:w-[40%] h-auto lg:h-full flex flex-col justify-between py-4 lg:py-8 lg:pl-10">

                    <div>
                        <p className="font-mono text-[10px] md:text-[12px] tracking-[0.4em] text-[#00E5FF] mb-2 md:mb-4 uppercase">
                            03 // System Capabilities
                        </p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#F5F0E8] tracking-tighter leading-[0.9]" style={{ fontFamily: '"Syne", sans-serif' }}>
                            Technical <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7B5EA7]">Arsenal.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col w-full mt-8 lg:mt-8 flex-1 justify-around" role="tablist" aria-label="Technical skill categories">
                        {SKILL_CATEGORIES.map((cat, idx) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveIdx(idx)}
                                role="tab"
                                aria-selected={activeIdx === idx}
                                aria-controls="skills-stage"
                                className="group flex items-center gap-4 py-3 cursor-pointer border-b border-white/5 relative w-full text-left bg-transparent"
                            >
                                <div
                                    className={`absolute bottom-[-1px] left-0 h-[1px] transition-all duration-500 ease-out ${activeIdx === idx ? 'w-full' : 'w-0 group-hover:w-full'}`}
                                    style={{ backgroundColor: cat.accent }}
                                />

                                <span className={`font-mono text-xs transition-colors duration-300 ${activeIdx === idx ? 'text-white' : 'text-white/20 group-hover:text-white'}`}>
                                    {cat.id}
                                </span>

                                <h3
                                    className={`text-lg md:text-xl lg:text-2xl font-bold tracking-tight transition-all duration-300 transform ${activeIdx === idx ? 'text-white translate-x-3' : 'text-white/40 group-hover:translate-x-3'}`}
                                    style={{ fontFamily: '"Syne", sans-serif' }}
                                >
                                    {cat.title}
                                </h3>

                                <svg
                                    className={`ml-auto w-5 h-5 transition-all duration-300 ${activeIdx === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                                    style={{ color: cat.accent }}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

// ── THE GSAP ORBITAL ENGINE (NOW WITH MATCH-MEDIA) ─────────────────────────
function FloatingNodes({ skills }: { skills: { name: string, sym: string, color: string }[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Using GSAP MatchMedia to construct different physics for Mobile vs Desktop
        let mm = gsap.matchMedia(containerRef);

        mm.add({
            isMobile: "(max-width: 1023px)", // Anything below lg breakpoint
            isDesktop: "(min-width: 1024px)"
        }, (context) => {
            // Context gives us our boolean conditions
            let { isMobile } = context.conditions as any;
            const total = skills.length;

            nodesRef.current.forEach((node, i) => {
                if (!node) return;

                // 1. Calculate perfect Orbital Distribution
                const angle = (i / total) * Math.PI * 2;

                // MOBILE FIX: Drastically tighter radius on mobile so nothing clips the box
                const radiusX = isMobile ? 95 : 180;
                const radiusY = isMobile ? 75 : 140;

                const targetX = Math.cos(angle) * radiusX;
                const targetY = Math.sin(angle) * radiusY;

                // 2. Explosion Entrance
                gsap.fromTo(node,
                    { opacity: 0, scale: 0, x: 0, y: 0, rotationY: 90 },
                    {
                        opacity: 1,
                        rotationY: 0,
                        x: targetX,
                        y: targetY,
                        // MOBILE FIX: Scale the actual 3D nodes down slightly on small screens
                        scale: isMobile ? 0.8 : 1,
                        duration: 1.2,
                        delay: i * 0.05,
                        ease: "back.out(1.2)",
                        onComplete: () => {
                            // 3. Continuous Zero-Gravity Float
                            gsap.to(node, {
                                // MOBILE FIX: Less drift distance so they don't wander off-screen
                                x: targetX + gsap.utils.random(isMobile ? -8 : -15, isMobile ? 8 : 15),
                                y: targetY + gsap.utils.random(isMobile ? -8 : -15, isMobile ? 8 : 15),
                                rotationZ: gsap.utils.random(-6, 6),
                                duration: gsap.utils.random(3, 5),
                                ease: "sine.inOut",
                                yoyo: true,
                                repeat: -1
                            });
                        }
                    }
                );
            });
        });

        // Cleanup the matchMedia instance
        return () => mm.revert();
    }, [skills]);

    return (
        <div ref={containerRef} className="absolute inset-0 flex items-center justify-center pointer-events-auto perspective-1000">
            {skills.map((skill, i) => (
                <div
                    key={`${skill.name}-${i}`}
                    ref={(el) => { nodesRef.current[i] = el; }}
                    className="absolute flex flex-col items-center justify-center transform-style-3d cursor-default group hover:z-50 transition-shadow duration-300"
                    aria-label={`Skill: ${skill.name}`}
                    style={{
                        width: '85px',
                        height: '85px',
                        borderRadius: '20px',
                        // Base Glass Look
                        background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01))`,
                        backdropFilter: 'blur(20px)',
                        borderTop: `1px solid rgba(255,255,255,0.4)`,
                        borderLeft: `1px solid rgba(255,255,255,0.2)`,
                        borderBottom: `1px solid rgba(0,0,0,0.5)`,
                        borderRight: `1px solid rgba(0,0,0,0.5)`,
                        // Brand-specific glow
                        boxShadow: `inset 0 4px 20px rgba(255,255,255,0.1), inset 0 -4px 20px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.5), 0 0 25px ${skill.color}40`
                    }}
                    onMouseEnter={(e) => {
                        // Avoid scale jump bugs on hover for mobile, let the animation handle it
                        if (window.innerWidth >= 1024) {
                            e.currentTarget.style.transform += " scale(1.1)";
                        }
                        e.currentTarget.style.boxShadow = `inset 0 4px 20px rgba(255,255,255,0.2), inset 0 -4px 20px rgba(0,0,0,0.3), 0 15px 40px rgba(0,0,0,0.7), 0 0 40px ${skill.color}80`;
                    }}
                    onMouseLeave={(e) => {
                        if (window.innerWidth >= 1024) {
                            e.currentTarget.style.transform = e.currentTarget.style.transform.replace(" scale(1.1)", "");
                        }
                        e.currentTarget.style.boxShadow = `inset 0 4px 20px rgba(255,255,255,0.1), inset 0 -4px 20px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.5), 0 0 25px ${skill.color}40`;
                    }}
                >
                    {/* The "Element Symbol" with Brand Text Shadow */}
                    <span
                        className="font-black text-3xl tracking-tighter transition-all duration-300"
                        style={{
                            fontFamily: '"Syne", sans-serif',
                            color: '#FFFFFF',
                            textShadow: `0 4px 10px rgba(0,0,0,0.5), 0 0 15px ${skill.color}`
                        }}
                    >
                        {skill.sym}
                    </span>

                    {/* The Full Name */}
                    <span
                        className="absolute bottom-2 font-mono text-[8.5px] uppercase tracking-widest text-center w-full px-1 leading-tight"
                        style={{ color: '#F5F0E8', opacity: 0.8 }}
                    >
                        {skill.name}
                    </span>
                </div>
            ))}

            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
            `}</style>
        </div>
    );
}