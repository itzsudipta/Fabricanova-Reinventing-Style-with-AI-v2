'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Code, PenTool, Sparkles, User,
    Linkedin, Twitter, ArrowRight,
    Heart, Cpu, Palette, Terminal
} from 'lucide-react';
import Navbar from '../../component/Navbar'; // Double dot
import Footer from '../../component/footer'; // Double dot

export default function TeamPage() {
    const teamMembers = [
        {
            name: "Sudipta Sarkar",
            role: "Lead Developer (Web & ML)",
            icon: Code,
            id: "DEV_01",
            image: "/Team/SudiptaSakar.jpeg",
            bio: "Building the bridge between React frontends and Stable Diffusion pipelines.",
            tags: ["React", "FastAPI", "PyTorch"]
        },
        {
            name: "Avirup Guha Biswas",
            role: "Documentation & QA Lead",
            icon: PenTool,
            id: "QA_01",
            image: "/Team/Avirup.jpeg",
            bio: "Ensuring every pixel and endpoint meets our rigorous production standards.",
            tags: ["Testing", "System Arch", "Docs"]
        },
        {
            name: "Reema Das",
            role: "UI/UX Designer",
            icon: Sparkles,
            id: "DES_01",
            image: "/Team/ReemaDas.jpeg",
            bio: "Crafting intuitive interfaces for complex generative workflows.",
            tags: ["Figma", "User Flow", "Visuals"]
        },
        {
            name: "Swagata Lahiri",
            role: "Data & Research Lead",
            icon: User,
            id: "RES_01",
            image: "/Team/Swagslahiri.jpeg",
            bio: "Curating and training the datasets that power our neural models.",
            tags: ["Data Eng", "Model Training", "Analytics"]
        },
    ];

    const values = [
        { title: "Ethical AI", icon: Heart, text: "We strictly use consented datasets. No artist left behind." },
        { title: "Craft First", icon: Palette, text: "Technology serves the artisan, never the other way around." },
        { title: "Open Science", icon: Cpu, text: "Contributing back to the open-source ML community." },
    ];

    return (
        <div className="bg-stone-50 min-h-screen font-sans selection:bg-purple-200 selection:text-purple-900">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[120px] mix-blend-multiply"></div>
                    <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row gap-16 items-end">
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white/60 backdrop-blur-md mb-8 shadow-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-stone-900"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">The Collective</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="font-serif text-6xl md:text-8xl text-stone-900 leading-[0.95] mb-8"
                            >
                                Minds behind <br />
                                <span className="italic text-stone-400">the Machine.</span>
                            </motion.h1>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex-1 md:pb-4"
                        >
                            <p className="text-xl text-stone-600 font-light leading-relaxed max-w-md border-l-2 border-purple-200 pl-8">
                                Fabricanova is a diverse collective of engineers, designers, and historians united by a single mission:
                                <span className="font-medium text-stone-900"> To give every creator a neural loom.</span>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- VALUES GRID --- */}
            <section className="bg-white border-y border-stone-200">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                    {values.map((val, i) => (
                        <div key={i} className="p-12 group hover:bg-stone-50 transition-colors duration-500">
                            <div className="flex items-center justify-between mb-8 text-stone-300 group-hover:text-purple-600 transition-colors">
                                <val.icon size={28} strokeWidth={1} />
                                <span className="text-xs font-mono border border-stone-100 px-2 py-1 rounded bg-stone-50 text-stone-400">0{i + 1}</span>
                            </div>
                            <h3 className="font-serif text-3xl text-stone-900 mb-4">{val.title}</h3>
                            <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-xs">{val.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- TEAM GRID --- */}
            <section className="py-32 px-6 relative bg-stone-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-20">
                        <h2 className="font-serif text-5xl text-stone-900">Core Team</h2>
                        <span className="hidden md:block text-stone-400 font-mono text-xs uppercase tracking-widest">Est. 2024 • Kolkata</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group"
                            >
                                {/* IMAGE CARD */}
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-200 mb-6 shadow-md group-hover:shadow-2xl group-hover:shadow-stone-900/10 transition-all duration-500">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                    />

                                    {/* Floating ID Tag */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur text-[9px] font-mono font-bold px-2 py-1 rounded text-stone-900 uppercase tracking-widest border border-stone-200">
                                            {member.id}
                                        </span>
                                    </div>

                                    {/* Social Overlay */}
                                    <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">
                                            <Linkedin size={14} />
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-colors">
                                            <Twitter size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* TEXT CONTENT */}
                                <div className="pr-4">
                                    <div className="flex items-center gap-2 mb-2 text-stone-400">
                                        <member.icon size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{member.role}</span>
                                    </div>
                                    <h3 className="font-serif text-2xl text-stone-900 mb-3 group-hover:text-purple-900 transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-stone-500 leading-relaxed mb-4 border-l border-stone-200 pl-3">
                                        {member.bio}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {member.tags.map((tag, t) => (
                                            <span key={t} className="text-[10px] bg-white border border-stone-200 px-2 py-1 rounded text-stone-500">
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

            {/* --- GRADIENT CTA --- */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden px-8 py-20 md:p-24 text-center border border-white shadow-2xl shadow-purple-900/5 group">
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950"></div>
                        <div className="absolute top-0 right-0 w-full h-full opacity-40">
                            <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse"></div>
                            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-500 rounded-full blur-[120px]"></div>
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto text-white">
                            <div className="flex justify-center mb-6">
                                <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-200 border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded-full">
                                    <Terminal size={12} /> Hiring: Phase II
                                </span>
                            </div>
                            <h2 className="font-serif text-4xl md:text-6xl mb-6">
                                Join the <span className="italic text-purple-200">Revolution.</span>
                            </h2>
                            <p className="text-stone-300 text-lg mb-10 leading-relaxed">
                                We are looking for Senior Rust Engineers and Generative Artists to help us build the future of fashion.
                            </p>
                            <Link href="#" className="inline-flex h-14 px-8 bg-white text-stone-950 rounded-full font-bold items-center gap-3 hover:scale-105 transition-transform">
                                View Open Roles <ArrowRight size={18} />
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