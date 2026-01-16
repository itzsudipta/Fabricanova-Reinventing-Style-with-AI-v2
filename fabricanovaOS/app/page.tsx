'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
    Sparkles, Code, PenTool, User, ArrowRight,
    LayoutDashboard, PlayCircle
} from 'lucide-react';
import Navbar from '../component/Navbar'; // Correct Path
import Footer from '../component/footer'; // Correct Path

export default function Home() {
    const router = useRouter();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });

    // Parallax effect for the hero
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    // --- AUTH STATE ---
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // --- TEAM DATA ---
    const teamMembers = [
        {
            name: "Sudipta Sarkar",
            role: "Lead Developer (Web & ML)",
            icon: Code,
            id: "TEAMF_01",
            image: "/Team/SudiptaSakar.jpeg",
            tags: ["React", "Stable Diffusion"]
        },
        {
            name: "Avirup Guha Biswas",
            role: "Documentation & QA Lead",
            icon: PenTool,
            id: "TEAMF_02",
            image: "/Team/Avirup.jpeg",
            tags: ["Technical Writing", "QA"]
        },
        {
            name: "Reema Das",
            role: "UI/UX Designer",
            icon: Sparkles,
            id: "TEAMF_03",
            image: "/Team/ReemaDas.jpeg",
            tags: ["Visual Design", "Figma"]
        },
        {
            name: "Swagata Lahiri",
            role: "Data & Research Lead",
            icon: User,
            id: "TEAMF_04",
            image: "/Team/Swagslahiri.jpeg",
            tags: ["Data Engineering", "Models"]
        },
    ];

    return (
        <div className="bg-stone-50 selection:bg-purple-200 selection:text-purple-900" ref={targetRef}>
            <Navbar user={user} />

            {/* --- HERO SECTION --- */}
            <main className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">

                {/* Background Architecture */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                    {/* Soft Aurora Blob */}
                    <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-b from-purple-100/60 to-orange-100/40 rounded-full blur-[100px] opacity-70 mix-blend-multiply"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 z-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:col-span-7 relative"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white/60 backdrop-blur-md mb-8 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">System V2.0 Live</span>
                            </div>

                            <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] text-stone-900 mb-8 tracking-tight">
                                The Neural <br />
                                <span className="italic font-light text-stone-400">Loom.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-stone-600 max-w-lg leading-relaxed mb-10 font-light border-l-2 border-purple-200 pl-6">
                                Transform abstract concepts into production-ready fashion designs.
                                <span className="block mt-2 font-medium text-stone-900">From thought to thread in seconds.</span>
                            </p>

                            {!loading && (
                                <div className="flex flex-wrap gap-4">
                                    {user ? (
                                        <Link href="/studio" className="group h-14 px-8 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-all flex items-center gap-3 shadow-xl shadow-stone-900/10 hover:shadow-stone-900/20 hover:-translate-y-1">
                                            <LayoutDashboard size={18} />
                                            <span>Enter Studio</span>
                                            <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/auth" className="group h-14 px-8 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-all flex items-center gap-3 shadow-xl shadow-stone-900/10 hover:-translate-y-1">
                                                <Sparkles size={18} /> Start Creating
                                            </Link>
                                            <button className="h-14 px-8 rounded-lg font-medium text-stone-600 hover:bg-stone-100 transition-all flex items-center gap-2 border border-stone-200 bg-white shadow-sm">
                                                <PlayCircle size={18} /> Showreel
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Abstract Visual Side */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                            className="lg:col-span-5 relative hidden lg:block"
                        >
                            {/* Glassmorphism Card */}
                            <div className="relative aspect-[4/5] bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/10 border border-white/50 ring-1 ring-stone-900/5">
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-50"></div>

                                {/* UI Elements */}
                                <div className="absolute top-6 left-6 right-6 flex justify-between items-center border-b border-stone-200/50 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                                    </div>
                                    <div className="text-[10px] font-mono text-stone-400">AI_MODEL: SDXL_TURBO</div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    {/* Rotating Ring */}
                                    <div className="w-56 h-56 border-[1px] border-stone-900/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                    <div className="w-40 h-40 border border-dashed border-stone-900/20 rounded-full absolute animate-[spin_15s_linear_infinite_reverse]"></div>
                                    {/* Center Icon */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-400 rounded-xl shadow-lg flex items-center justify-center text-white animate-pulse">
                                        <Sparkles size={28} fill="currentColor" />
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md rounded-lg p-4 border border-white shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] text-stone-500 font-bold tracking-widest uppercase">Generating Texture...</span>
                                    </div>
                                    <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-orange-400 w-2/3 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* --- LIGHT EDITORIAL SCROLL BANNER --- */}
            <div className="w-full bg-white border-y border-stone-200 py-6 overflow-hidden relative z-20">
                <div className="animate-marquee whitespace-nowrap flex gap-16 text-xl md:text-3xl font-serif italic text-stone-300">
                    <span className="text-stone-900 not-italic font-bold tracking-tighter">Generative</span>
                    <span>Vector Output</span>
                    <span className="text-stone-900 not-italic font-bold tracking-tighter">Tech Packs</span>
                    <span>Fashion MNIST</span>
                    <span className="text-stone-900 not-italic font-bold tracking-tighter">Neural</span>
                    <span>Editorial</span>
                    <span className="text-stone-900 not-italic font-bold tracking-tighter">Generative</span>
                    <span>Vector Output</span>
                    <span className="text-stone-900 not-italic font-bold tracking-tighter">Tech Packs</span>
                </div>
            </div>

            {/* --- TEAM SECTION --- */}
            <section className="py-32 bg-stone-50 relative" id="team">
                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-2xl"
                        >
                            <span className="text-purple-600 font-bold tracking-widest text-xs uppercase mb-4 block">The Collective</span>
                            <h2 className="font-serif text-5xl md:text-6xl text-stone-900 leading-[1.1]">
                                Architects of the <br />
                                <span className="italic text-stone-400">Digital Thread.</span>
                            </h2>
                        </motion.div>
                        <div className="hidden md:block pb-2">
                            <Link href="/team" className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-stone-900 hover:text-purple-600 transition-colors">
                                <span className="border-b border-transparent group-hover:border-purple-600 transition-all">Full Roster</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`
                                    group relative flex flex-col justify-between 
                                    bg-white border border-stone-200 p-4 
                                    hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-500
                                    ${i % 2 === 1 ? 'lg:translate-y-12' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-mono text-[9px] text-stone-400 border border-stone-100 px-1.5 py-0.5 rounded">
                                        {member.id}
                                    </span>
                                    <member.icon size={16} className="text-stone-300 group-hover:text-purple-600 transition-colors" />
                                </div>

                                <div className="aspect-[3/4] overflow-hidden bg-stone-100 mb-6 relative">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                    />
                                    {/* Light Overlay effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-xl text-stone-900 mb-1 group-hover:text-purple-900 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                                        {member.role}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {member.tags.slice(0, 2).map((tag, t) => (
                                            <span key={t} className="text-[9px] px-2 py-0.5 bg-stone-50 text-stone-500 rounded-sm group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- NEW: AWESOME GRADIENT CTA --- */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden px-8 py-20 md:p-20 text-center border border-white shadow-2xl shadow-purple-900/5">
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-orange-50"></div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-60">
                            <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-300 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
                            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-300 rounded-full blur-[120px] mix-blend-multiply"></div>
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-6">
                                Ready to weave the <br /> <span className="italic text-purple-600">future?</span>
                            </h2>
                            <p className="text-stone-600 text-lg mb-10 leading-relaxed">
                                Join 10,000+ designers using Fabricanova to redefine their creative process. No credit card required for beta access.
                            </p>
                            <Link href="/auth" className="inline-flex h-14 px-8 bg-stone-900 text-white rounded-full font-bold items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-stone-900/20">
                                Get Started Free <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULAR FOOTER */}
            <Footer />
        </div>
    );
}