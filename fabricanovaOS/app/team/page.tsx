'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Code, PenTool, Sparkles, User,
    Github, Linkedin, Twitter, Globe, Heart, Cpu, Palette
} from 'lucide-react';
// Import your existing Navbar
import Navbar from '../../component/Navbar';

export default function TeamPage() {
    const teamMembers = [
        { name: "Elena V.", role: "Lead Architect", icon: Code, bio: "Ex-Google AI. Building the neural backbone." },
        { name: "Marc D.", role: "Creative Director", icon: PenTool, bio: "Parsons graduate. Bridging trad fashion & tech." },
        { name: "Sarah L.", role: "ML Engineer", icon: Sparkles, bio: "Specialist in diffusion models and fabric physics." },
        { name: "James R.", role: "Product Strategy", icon: User, bio: "Scaling ethical AI tools for creators." },
        { name: "Alex K.", role: "Frontend Lead", icon: Globe, bio: "Crafting fluid, zero-latency canvas experiences." },
        { name: "Nina P.", role: "Fashion Historian", icon: Palette, bio: "Ensuring cultural accuracy in AI generation." },
    ];

    const values = [
        { title: "Ethical AI", icon: Heart, text: "We respect artist ownership and training data consent." },
        { title: "Craft First", icon: Palette, text: "Technology serves the artisan, not the other way around." },
        { title: "Open Science", icon: Cpu, text: "Contributing back to the open-source ML community." },
    ];

    return (
        <div className="bg-stone-50 min-h-screen">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 mb-6 block"
                    >
                        Our DNA
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-6xl md:text-7xl text-stone-900 mb-8 leading-tight"
                    >
                        We are building the <br />
                        <span className="italic text-stone-500">Digital Atelier.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        Fabricanova is a diverse collective of engineers, designers, and historians united by a single mission: To give every creator a neural loom.
                    </motion.p>
                </div>
            </section>

            {/* --- VALUES SECTION --- */}
            <section className="py-16 border-y border-stone-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                    {values.map((val, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-900 mb-4">
                                <val.icon size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{val.title}</h3>
                            <p className="text-sm text-stone-500 max-w-xs">{val.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- TEAM GRID (PREMIUM ROUNDED) --- */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm hover:shadow-2xl hover:shadow-stone-200/50 hover:-translate-y-2 transition-all duration-500 ease-out cursor-default relative overflow-hidden"
                            >
                                {/* Top Badge */}
                                <div className="flex justify-between items-center mb-8">
                                    <span className="bg-stone-50 border border-stone-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                        Mem_0{i + 1}
                                    </span>
                                </div>

                                {/* Avatar */}
                                <div className="flex justify-center mb-8">
                                    <div className="w-28 h-28 rounded-3xl bg-stone-50 border border-stone-100 flex items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-transform duration-500">
                                        <member.icon
                                            size={40}
                                            strokeWidth={1}
                                            className="text-stone-400 group-hover:text-stone-900 transition-colors duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">
                                        {member.role}
                                    </p>
                                    <p className="text-stone-500 text-sm leading-relaxed mb-8 opacity-80">
                                        {member.bio}
                                    </p>

                                    {/* Socials */}
                                    <div className="flex justify-center gap-4">
                                        <Link href="#" className="p-2 rounded-full bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-400 transition-colors">
                                            <Twitter size={16} />
                                        </Link>
                                        <Link href="#" className="p-2 rounded-full bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-400 transition-colors">
                                            <Linkedin size={16} />
                                        </Link>
                                        <Link href="#" className="p-2 rounded-full bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-400 transition-colors">
                                            <Github size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- JOIN CTA --- */}
            <section className="pb-32 px-6">
                <div className="max-w-4xl mx-auto bg-stone-900 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-500 via-stone-900 to-stone-900" />

                    <div className="relative z-10">
                        <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Join the Revolution</h2>
                        <p className="text-stone-400 mb-10 text-lg max-w-xl mx-auto">
                            We are currently hiring for Senior Rust Engineers and 3D Generative Artists.
                        </p>
                        <button className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold tracking-wide hover:bg-stone-200 transition-colors">
                            View Open Roles
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}