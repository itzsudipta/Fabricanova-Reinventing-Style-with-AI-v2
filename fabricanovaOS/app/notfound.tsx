'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, LayoutDashboard, AlertCircle, Terminal } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900">

            {/* --- BACKGROUND FX --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                {/* Subtle "Error" Red Tint */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-50"></div>
            </div>

            <div className="max-w-3xl w-full px-6 relative z-10 text-center">

                {/* --- GLITCH 404 --- */}
                <div className="relative inline-block mb-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-serif text-[12rem] md:text-[16rem] leading-none text-stone-900 font-bold tracking-tighter mix-blend-darken"
                    >
                        404
                    </motion.h1>

                    {/* Decorative Glitch Overlay */}
                    <motion.div
                        animate={{
                            x: [-2, 2, -1, 1, 0],
                            opacity: [0.5, 0.2, 0.5]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.2,
                            repeatType: "mirror",
                            repeatDelay: 3
                        }}
                        className="absolute inset-0 text-red-500/30 mix-blend-multiply pointer-events-none"
                        style={{ clipPath: 'inset(40% 0 45% 0)' }}
                    >
                        404
                    </motion.div>
                </div>

                {/* --- CONTENT --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="h-px w-12 bg-stone-300"></span>
                        <span className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold flex items-center gap-2">
                            <AlertCircle size={12} /> Pattern Not Found
                        </span>
                        <span className="h-px w-12 bg-stone-300"></span>
                    </div>

                    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
                        This thread has <span className="italic text-stone-400">unraveled.</span>
                    </h2>

                    <p className="text-stone-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        The garment you are looking for has been moved, deleted, or never existed in this timeline.
                    </p>

                    {/* --- TECHNICAL LOG (Visual Decoration) --- */}
                    <div className="max-w-md mx-auto bg-white border border-stone-200 p-4 rounded-lg mb-10 text-left shadow-sm rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="flex gap-1.5 mb-3 border-b border-stone-100 pb-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        </div>
                        <div className="font-mono text-[10px] text-stone-400 space-y-1">
                            <p> ERROR_CODE: PAGE_MISSING</p>
                            <p> REF: /fabric/texture/null</p>
                            <p> STATUS: <span className="text-red-500">CRITICAL_SEAM_FAILURE</span></p>
                            <p className="animate-pulse"> _</p>
                        </div>
                    </div>

                    {/* --- ACTIONS --- */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/" className="h-14 px-8 border border-stone-300 bg-white text-stone-900 rounded-full font-medium hover:bg-stone-50 transition-all flex items-center gap-2 w-full md:w-auto justify-center group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Return Home
                        </Link>

                        <Link href="/studio" className="h-14 px-8 bg-stone-900 text-white rounded-full font-bold flex items-center gap-2 shadow-xl shadow-stone-900/10 hover:scale-105 transition-transform w-full md:w-auto justify-center">
                            <LayoutDashboard size={18} />
                            Go to Studio
                        </Link>
                    </div>

                </motion.div>
            </div>

            {/* Footer decoration */}
            <div className="absolute bottom-8 text-xs font-mono text-stone-300 uppercase tracking-widest">
                System V2.0 // Fabricanova
            </div>
        </div>
    );
}