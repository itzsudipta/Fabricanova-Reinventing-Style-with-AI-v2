'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

<Link href="/team" className="hover:text-stone-900 transition-colors">Team</Link>

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-stone-50/90 backdrop-blur-md border-b border-stone-200 py-3' : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center rounded-sm">
                        <span className="font-serif font-bold text-xl italic">F</span>
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:opacity-70 transition-opacity">
                        Fabricanova
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/auth" className="text-stone-900 text-sm font-medium hover:underline">Sign In</Link>
                    <Link href="/studio" className="bg-stone-900 text-stone-50 px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-stone-800 flex items-center gap-2">
                        <Sparkles size={14} /> Start Designing
                    </Link>
                </div>
            </div>
        </nav>
    );
}