'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Sparkles, Code, PenTool, User,
    Github, Linkedin, Twitter, ArrowRight
} from 'lucide-react';
import Navbar from '../component/Navbar';

export default function Home() {
    const teamMembers = [
        { name: "Elena V.", role: "Lead Architect", icon: Code },
        { name: "Marc D.", role: "Creative Director", icon: PenTool },
        { name: "Sarah L.", role: "ML Engineer", icon: Sparkles },
        { name: "James R.", role: "Product Strategy", icon: User },
    ];

    return (
        <>
            <Navbar />

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

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <Link href="/studio" className="h-14 px-8 bg-stone-900 text-white rounded-sm font-medium hover:bg-stone-800 transition-all flex items-center gap-2">
                                <Sparkles size={16} /> Open Studio
                            </Link>
                            <button className="h-14 px-8 border border-stone-300 bg-white/50 backdrop-blur-sm text-stone-900 rounded-sm font-medium hover:bg-white transition-all">
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* --- TEAM SECTION --- */}
            <section className="py-32 bg-stone-50 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-stone-200/50 blur-[100px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-4 block">The Collective</span>
                        <h2 className="font-serif text-5xl text-stone-900 mb-6">Crafting Intelligence.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {teamMembers.map((member, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm text-center group hover:-translate-y-2 transition-transform duration-500">
                                <div className="flex justify-center mb-4 text-stone-400 group-hover:text-stone-900 transition-colors">
                                    <member.icon size={48} strokeWidth={1} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-stone-900">{member.name}</h3>
                                <p className="text-xs uppercase text-stone-400 tracking-wider mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/team" className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3 rounded-full text-sm font-bold tracking-wide hover:bg-stone-800 transition-all">
                            View Full Team <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER (HERE IT IS!) --- */}
            <footer className="bg-stone-950 py-20 border-t border-stone-900 text-stone-400 font-sans text-sm">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
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

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="text-stone-50 font-bold uppercase tracking-widest text-xs mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="/studio" className="hover:text-stone-50 transition-colors">Design Studio</Link></li>
                            <li><Link href="/pricing" className="hover:text-stone-50 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">API Access</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Showcase</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="text-stone-50 font-bold uppercase tracking-widest text-xs mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/team" className="hover:text-stone-50 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Legal</Link></li>
                            <li><Link href="#" className="hover:text-stone-50 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
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

                {/* Bottom Bar */}
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