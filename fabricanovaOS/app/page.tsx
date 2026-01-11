'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
    Sparkles, Code, PenTool, User,
    Github, Linkedin, Twitter, ArrowRight,
    LogOut, LayoutDashboard
} from 'lucide-react';
import Navbar from '../component/Navbar';

export default function Home() {
    const router = useRouter();

    // --- AUTH STATE MANAGEMENT ---
    const [user, setUser] = useState<any>(null); // Added <any> to fix potential type issues
    const [loading, setLoading] = useState(true);

    // Initialize Supabase Client
    // FIX: Added '!' to force TypeScript to accept these are defined
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // 1. Check active session on load
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        getUser();

        // 2. Listen for changes (Login/Logout in other tabs)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Handle Sign Out
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.refresh();
    };

    const teamMembers = [
        { name: "Elena V.", role: "Lead Architect", icon: Code },
        { name: "Marc D.", role: "Creative Director", icon: PenTool },
        { name: "Sarah L.", role: "ML Engineer", icon: Sparkles },
        { name: "James R.", role: "Product Strategy", icon: User },
    ];

    return (
        <>
            {/* Pass user prop to Navbar if your Navbar supports it */}
            <Navbar user={user} />

            {/* --- HERO SECTION --- */}
            <main className="relative min-h-screen flex items-center justify-center bg-stone-50 overflow-hidden pt-20">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-stone-200 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-5xl mx-auto px-6 text-center z-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 border border-stone-200 rounded-full bg-white/50 backdrop-blur-sm text-xs font-semibold tracking-wider uppercase text-stone-500 mb-6">
                            V2.0 Public Beta
                        </span>
                        <h1 className="font-serif text-6xl md:text-8xl font-medium leading-[1.1] text-stone-900 mb-8">
                            The Neural Loom for <br />
                            <span className="italic text-stone-500">Modern Fashion.</span>
                        </h1>
                        <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-10 font-light">
                            Design fashion with AI. From abstract thought to technical vector sketch in seconds.
                        </p>

                        {/* --- AUTHENTICATED BUTTONS --- */}
                        {!loading && (
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                {user ? (
                                    // STATE: LOGGED IN
                                    <>
                                        <div className="flex flex-col items-center gap-2 mb-4 md:mb-0 md:hidden">
                                            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                                                Welcome back, {user.email?.split('@')[0]}
                                            </span>
                                        </div>

                                        <Link href="/studio" className="h-14 px-8 bg-stone-900 text-white rounded-sm font-medium hover:bg-stone-800 transition-all flex items-center gap-2 shadow-lg shadow-stone-900/10">
                                            <LayoutDashboard size={16} /> Enter Studio
                                        </Link>

                                        <button
                                            onClick={handleSignOut}
                                            className="h-14 px-8 border border-stone-300 bg-white/50 backdrop-blur-sm text-stone-900 rounded-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center gap-2"
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    // STATE: LOGGED OUT
                                    <>
                                        <Link href="/auth" className="h-14 px-8 bg-stone-900 text-white rounded-sm font-medium hover:bg-stone-800 transition-all flex items-center gap-2 shadow-lg shadow-stone-900/10">
                                            <Sparkles size={16} /> Start Designing
                                        </Link>
                                        <button className="h-14 px-8 border border-stone-300 bg-white/50 backdrop-blur-sm text-stone-900 rounded-sm font-medium hover:bg-white transition-all">
                                            Watch Demo
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Loading State Placeholder */}
                        {loading && (
                            <div className="h-14 w-full flex justify-center items-center">
                                <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
                            </div>
                        )}

                    </motion.div>
                </div>
            </main>

            {/* --- TEAM SECTION --- */}
            <section className="py-32 bg-stone-50 relative overflow-hidden" id="team">
                <div className="absolute top-0 right-0 w-1/3 h-full border-l border-dashed border-stone-200 pointer-events-none opacity-50" />
                <div className="absolute top-20 left-10 w-24 h-24 border border-stone-200 rounded-full opacity-40 animate-pulse" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-stone-200 pb-8">
                        <div className="max-w-2xl">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-stone-400 mb-4"
                            >
                                <span className="w-8 h-[1px] bg-stone-400"></span>
                                02 — The Collective
                            </motion.span>
                            <h2 className="font-serif text-5xl md:text-6xl text-stone-900 leading-tight">
                                Architects of the <br />
                                <span className="italic text-stone-400">Digital Thread.</span>
                            </h2>
                        </div>
                        <div className="hidden md:block pb-2">
                            <Link href="/team" className="group flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-stone-900 hover:text-stone-500 transition-colors">
                                Meet Everyone
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`group relative h-[420px] bg-white border border-stone-200 flex flex-col justify-between p-8 hover:bg-stone-900 transition-all duration-500 cursor-pointer ${i % 2 === 1 ? 'lg:translate-y-12' : ''}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-bold uppercase tracking-widest border border-stone-200 px-2 py-1 rounded-full text-stone-400 group-hover:border-stone-700 group-hover:text-stone-300 transition-colors">
                                        {member.role}
                                    </span>
                                    <div className="bg-stone-50 p-3 rounded-full text-stone-900 group-hover:bg-stone-800 group-hover:text-white transition-colors duration-500">
                                        <member.icon size={20} strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="absolute top-1/2 left-0 w-full px-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <svg width="100%" height="40" className="stroke-stone-900 group-hover:stroke-stone-500">
                                        <path d="M0 20 Q 50 0, 100 20 T 200 20" fill="none" strokeWidth="1" />
                                    </svg>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="font-serif text-3xl text-stone-900 group-hover:text-white transition-colors duration-300 mb-2">
                                        {member.name}
                                    </h3>
                                    <div className="flex items-center justify-between overflow-hidden h-0 group-hover:h-8 transition-all duration-500">
                                        <span className="text-xs text-stone-500 font-mono">Based in Paris, FR</span>
                                        <ArrowRight size={14} className="text-white -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 md:hidden text-center">
                        <Link href="/team" className="inline-block border-b border-stone-900 pb-1 text-sm font-bold uppercase tracking-widest">
                            View Full Team
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-stone-950 py-20 border-t border-stone-900 text-stone-400 font-sans text-sm">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">

                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-stone-50 text-stone-950 flex items-center justify-center rounded-sm">
                                <span className="font-serif font-bold italic">F</span>
                            </div>
                            <span className="font-serif text-xl font-bold text-stone-50">Fabricanova</span>
                        </div>
                        <p className="mb-6 leading-relaxed opacity-80">
                            The neural loom for the next generation of fashion designers. Built in Paris & San Francisco.
                        </p>
                        <div className="flex gap-4">
                            <Twitter size={18} className="hover:text-stone-50 cursor-pointer transition-colors" />
                            <Github size={18} className="hover:text-stone-50 cursor-pointer transition-colors" />
                            <Linkedin size={18} className="hover:text-stone-50 cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-stone-50 font-bold uppercase tracking-widest text-xs mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="/studio" className="hover:text-stone-50 transition-colors">Design Studio</Link></li>
                            <li><Link href="/pricing" className="hover:text-stone-50 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">API Access</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Showcase</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-stone-50 font-bold uppercase tracking-widest text-xs mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/team" className="hover:text-stone-50 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Legal</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-stone-50 font-bold uppercase tracking-widest text-xs mb-6">Updates</h4>
                        <p className="mb-4 opacity-80">Join the waiting list for Fabricanova Enterprise.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="email@fashion.com"
                                className="bg-stone-900 border border-stone-800 rounded px-3 py-2 w-full focus:outline-none focus:border-stone-600 transition-colors"
                            />
                            <button className="bg-stone-50 text-stone-950 px-3 rounded hover:bg-stone-200 transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center opacity-60">
                    <p>© 2026 Fabricanova Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </footer>
        </>
    );
}