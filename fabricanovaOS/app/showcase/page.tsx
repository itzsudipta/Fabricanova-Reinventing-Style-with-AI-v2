'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Filter, ArrowUpRight, Download,
    Layers, Zap, Search, ArrowRight,
    Maximize2, Share2
} from 'lucide-react';
import Navbar from '../../component/Navbar';
import Footer from '../../component/footer';

// --- MOCK DATA ---
const galleryItems = [
    {
        id: 1,
        title: "Neon Baroque Jacket",
        category: "Haute Couture",
        image: "/showcase/baroque-jacket.jpg",
        tags: ["SDXL", "Velvet", "Gold"],
        date: "Oct 24",
        featured: true
    },
    {
        id: 2,
        title: "Cyber-Organic Dress",
        category: "Generative",
        image: "/showcase/cyber-dress.jpg",
        tags: ["Midjourney", "Bioluminescence"],
        date: "Nov 02",
        featured: false
    },
    {
        id: 3,
        title: "Modular Tech Pack V4",
        category: "Tech Packs",
        image: "/showcase/techpack-01.jpg",
        tags: ["Vector", "Technical", "Measurements"],
        date: "Sep 15",
        featured: false
    },
    {
        id: 4,
        title: "Nomad Utility Vest",
        category: "Streetwear",
        image: "/showcase/nomad-vest.jpg",
        tags: ["Gorpcore", "Functional"],
        date: "Dec 01",
        featured: true
    },
    {
        id: 5,
        title: "Ceramic Texture Study",
        category: "Textures",
        image: "/showcase/texture-ceramic.jpg",
        tags: ["Material", "4K Scale"],
        date: "Aug 20",
        featured: false
    },
    {
        id: 6,
        title: "Avant-Garde Silhouette",
        category: "Sketches",
        image: "/showcase/sketch-04.jpg",
        tags: ["Charcoal", "Concept"],
        date: "Jan 10",
        featured: true
    },
    {
        id: 7,
        title: "Liquid Metal Gown",
        category: "Generative",
        image: "/showcase/liquid-gown.jpg",
        tags: ["Chrome", "Fluidity"],
        date: "Dec 12",
        featured: false
    },
    {
        id: 8,
        title: "Eco-Weave Pattern",
        category: "Textures",
        image: "/showcase/eco-pattern.jpg",
        tags: ["Sustainable", "Seamless"],
        date: "Oct 05",
        featured: false
    },
];

const categories = ["All", "Generative", "Tech Packs", "Streetwear", "Sketches", "Textures"];

export default function ShowcasePage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredItems = activeFilter === "All"
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter);

    return (
        <div className="bg-stone-50 min-h-screen font-sans selection:bg-purple-200 selection:text-purple-900">
            <Navbar />

            {/* --- HERO HEADER --- */}
            <section className="relative pt-40 pb-20 px-6 border-b border-stone-200">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[100px] mix-blend-multiply"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <span className="w-12 h-[1px] bg-stone-900"></span>
                                <span className="text-xs font-bold uppercase tracking-[0.25em] text-stone-900">
                                    Archive V2.0
                                </span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-serif text-6xl md:text-8xl text-stone-900 leading-[0.9]"
                            >
                                The Generative <br />
                                <span className="italic text-stone-400">Collection.</span>
                            </motion.h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-xs pb-2"
                        >
                            <p className="text-sm text-stone-500 font-medium leading-relaxed border-l border-purple-200 pl-4">
                                Explore a curated library of AI-generated garments, tech packs, and material studies.
                                <br /><span className="text-stone-900 mt-2 block">Powered by Stable Diffusion XL.</span>
                            </p>
                        </motion.div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-stone-200 pt-8 opacity-60">
                        <div>
                            <p className="text-2xl font-serif text-stone-900">12k+</p>
                            <p className="text-[10px] uppercase tracking-widest text-stone-500">Assets Generated</p>
                        </div>
                        <div>
                            <p className="text-2xl font-serif text-stone-900">4.2s</p>
                            <p className="text-[10px] uppercase tracking-widest text-stone-500">Avg Generation Time</p>
                        </div>
                        <div>
                            <p className="text-2xl font-serif text-stone-900">8k</p>
                            <p className="text-[10px] uppercase tracking-widest text-stone-500">Resolution Support</p>
                        </div>
                        <div>
                            <p className="text-2xl font-serif text-stone-900">CC0</p>
                            <p className="text-[10px] uppercase tracking-widest text-stone-500">Commercial License</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STICKY FILTER BAR --- */}
            <div className="sticky top-20 z-40 my-12 pointer-events-none">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-stone-200/50 rounded-full p-2 flex justify-between items-center pointer-events-auto">

                        {/* Categories */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`
                                        px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap
                                        ${activeFilter === cat
                                            ? 'bg-stone-900 text-white shadow-md'
                                            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                                        }
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Visual Utilities */}
                        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-stone-200">
                            <div className="relative group">
                                <input type="text" placeholder="Search..." className="bg-transparent border-none text-xs outline-none w-24 focus:w-40 transition-all placeholder:text-stone-400 text-stone-900" />
                                <Search size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MASONRY GALLERY --- */}
            <main className="max-w-7xl mx-auto px-6 pb-32 min-h-[60vh]">
                <AnimatePresence mode='popLayout'>
                    <motion.div
                        layout
                        className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                    >
                        {filteredItems.map((item, index) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="break-inside-avoid group relative bg-white p-3 rounded-sm shadow-sm hover:shadow-2xl hover:shadow-stone-900/5 border border-stone-200 hover:border-stone-300 transition-all duration-500"
                            >
                                {/* Image Frame */}
                                <div className="relative overflow-hidden bg-stone-100 mb-4">
                                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                                        {item.featured && (
                                            <span className="bg-white/90 backdrop-blur text-[9px] font-bold px-2 py-1 uppercase tracking-widest text-stone-900 shadow-sm">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Overlay */}
                                    <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center gap-3 backdrop-blur-[1px]">
                                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-900 hover:scale-110 transition-transform shadow-lg">
                                            <Maximize2 size={16} />
                                        </button>
                                        <button className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                                            <Share2 size={16} />
                                        </button>
                                    </div>

                                    {/* The Image */}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://placehold.co/600x${index % 2 === 0 ? '800' : '600'}/e7e5e4/57534e?text=Generated+Asset`;
                                        }}
                                    />
                                </div>

                                {/* Metadata */}
                                <div className="px-2 pb-2">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                            {item.date}
                                        </span>
                                        <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                                            {item.category}
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-xl text-stone-900 mb-3 group-hover:text-purple-900 transition-colors">
                                        {item.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-stone-100">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-[9px] border border-stone-200 px-2 py-0.5 rounded-full text-stone-500 hover:border-stone-400 transition-colors cursor-default">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50 border-2 border-dashed border-stone-200 rounded-xl">
                        <Layers size={48} className="mb-4 text-stone-300" />
                        <h3 className="font-serif text-2xl text-stone-400">Archive Empty</h3>
                        <p className="text-sm text-stone-400 mt-2">No assets found for this category.</p>
                    </div>
                )}
            </main>

            {/* --- CTA SECTION --- */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden px-8 py-20 md:p-24 text-center border border-white shadow-2xl shadow-purple-900/5 group bg-stone-900">
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="absolute top-0 right-0 w-full h-full opacity-60">
                            <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse"></div>
                            <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-600 rounded-full blur-[120px]"></div>
                        </div>

                        <div className="relative z-10 max-w-2xl mx-auto text-white">
                            <h2 className="font-serif text-4xl md:text-6xl mb-6">
                                Create your <br /> own <span className="italic text-purple-200">collection.</span>
                            </h2>
                            <p className="text-stone-300 text-lg mb-10 leading-relaxed">
                                Join the studio to start generating your own designs, tech packs, and patterns instantly.
                            </p>
                            <Link href="/studio" className="inline-flex h-14 px-8 bg-white text-stone-950 rounded-full font-bold items-center gap-3 hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Enter Studio <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}