'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Code, PenTool, Sparkles, User,
    Github, Linkedin, Twitter, ArrowRight,
    Heart, Cpu, Palette, Terminal
} from 'lucide-react';
import Navbar from '../../component/Navbar';

export default function TeamPage() {
    const teamMembers = [
        {
            name: "Elena V.",
            role: "Lead Architect",
            icon: Code,
            id: "ARCH_01",
            bio: "Ex-Google AI. Building the neural backbone.",
            tags: ["Rust", "PyTorch", "Architecture"]
        },
        {
            name: "Marc D.",
            role: "Creative Director",
            icon: PenTool,
            id: "DSGN_01",
            bio: "Parsons graduate. Bridging trad fashion & tech.",
            tags: ["Clo3D", "Unreal", "Art Direction"]
        },
        {
            name: "Sarah L.",
            role: "ML Engineer",
            icon: Sparkles,
            id: "ENG_02",
            bio: "Specialist in diffusion models and fabric physics.",
            tags: ["Diffusion", "Physics", "Python"]
        },
        {
            name: "James R.",
            role: "Product Strategy",
            icon: User,
            id: "PROD_01",
            bio: "Scaling ethical AI tools for creators.",
            tags: ["Strategy", "Ethics", "Growth"]
        },
    ];

    const values = [
        { title: "Ethical AI", icon: Heart, text: "Strict consent protocols for training data." },
        { title: "Craft First", icon: Palette, text: "Tech that serves the artisan." },
        { title: "Open Science", icon: Cpu, text: "Contributing to open-source ML." },
    ];

    return (
        <div className="bg-stone-50 min-h-screen font-sans selection:bg-stone-900 selection:text-white">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden border-b border-stone-200">
                {/* Abstract Background Grid */}
                <div className="absolute inset-0 z-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-12 items-end">
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <span className="w-12 h-[1px] bg-stone-900"></span>
                                <span className="text-xs font-bold uppercase tracking-[0.25em] text-stone-900">
                                    The Collective
                                </span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="font-serif text-6xl md:text-8xl text-stone-900 leading-[0.9] mb-8"
                            >
                                Digital <br />
                                <span className="italic text-stone-400">Atelier.</span>
                            </motion.h1>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex-1 md:pb-4"
                        >
                            <p className="text-xl text-stone-600 font-light leading-relaxed max-w-md border-l border-stone-300 pl-6">
                                Fabricanova is a diverse collective of engineers, designers, and historians united by a single mission: To give every creator a neural loom.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- VALUES MANIFESTO --- */}
            <section className="bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                    {values.map((val, i) => (
                        <div key={i} className="p-10 group hover:bg-stone-50 transition-colors duration-500">
                            <div className="flex items-center justify-between mb-6 text-stone-400 group-hover:text-stone-900 transition-colors">
                                <val.icon size={24} strokeWidth={1} />
                                <span className="text-[10px] font-mono border border-stone-200 px-2 py-0.5 rounded-full">0{i + 1}</span>
                            </div>
                            <h3 className="font-serif text-2xl text-stone-900 mb-2">{val.title}</h3>
                            <p className="text-sm text-stone-500 font-medium leading-relaxed">{val.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- TEAM GRID (EDITORIAL STAGGERED) --- */}
            <section className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <h2 className="font-serif text-4xl text-stone-900">Core Team</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                // THE STAGGER: Pushing even columns down
                                className={`group relative min-h-[480px] flex flex-col justify-between border border-stone-200 bg-white p-6 hover:bg-stone-900 hover:border-stone-900 transition-all duration-500 ${i % 2 === 1 ? 'lg:translate-y-16' : ''}`}
                            >
                                {/* HEADER */}
                                <div className="flex justify-between items-start z-10">
                                    <div className="w-10 h-10 border border-stone-200 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-stone-800 group-hover:border-stone-700 group-hover:text-white transition-colors">
                                        <member.icon size={18} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-mono text-[10px] text-stone-400 group-hover:text-stone-500 transition-colors">
                                        {member.id}
                                    </span>
                                </div>

                                {/* CENTER VISUAL (Abstract Thread) */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                    <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-stone-700 to-transparent"></div>
                                </div>

                                {/* CONTENT */}
                                <div className="z-10 mt-auto">
                                    <div className="mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="font-serif text-3xl text-stone-900 group-hover:text-white transition-colors mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">
                                            {member.role}
                                        </p>
                                        <p className="text-sm text-stone-500 group-hover:text-stone-400 transition-colors leading-relaxed opacity-0 group-hover:opacity-100 duration-500 delay-100 absolute group-hover:relative">
                                            {member.bio}
                                        </p>
                                    </div>

                                    {/* FOOTER: Tags & Social */}
                                    <div className="pt-6 border-t border-stone-100 group-hover:border-stone-800 transition-colors flex justify-between items-center">
                                        <div className="flex gap-2">
                                            {member.tags.slice(0, 2).map((tag, t) => (
                                                <span key={t} className="text-[10px] font-mono border border-stone-200 px-2 py-1 rounded text-stone-400 group-hover:border-stone-700 group-hover:text-stone-300 transition-colors">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                            <Link href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter size={14} /></Link>
                                            <Link href="#" className="text-stone-400 hover:text-white transition-colors"><Linkedin size={14} /></Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- JOIN CTA (TERMINAL STYLE) --- */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto bg-stone-950 text-stone-50 rounded-sm p-12 md:p-24 relative overflow-hidden group">
                    {/* Animated Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6 text-stone-500">
                                <Terminal size={16} />
                                <span className="font-mono text-xs uppercase tracking-widest">System Status: Hiring</span>
                            </div>
                            <h2 className="font-serif text-5xl md:text-6xl mb-6">Join the <br /> Revolution.</h2>
                            <p className="text-stone-400 text-lg max-w-md">
                                Currently looking for Senior Rust Engineers and 3D Generative Artists.
                            </p>
                        </div>

                        <button className="h-16 px-10 border border-stone-700 hover:bg-white hover:text-stone-900 text-stone-50 font-medium text-lg rounded-sm transition-all duration-300 flex items-center gap-4 group/btn">
                            View Open Roles
                            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* --- FOOTER (FROM PREVIOUS PAGE) --- */}
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
        </div>
    );
}