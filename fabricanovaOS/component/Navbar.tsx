'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, LayoutDashboard, User } from 'lucide-react';

// 1. Define Props to accept the User object
interface NavbarProps {
    user?: any;
}

export default function Navbar({ user }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Mobile menu state
    const pathname = usePathname();

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Showcase', href: '/showcase' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Team', href: '/team' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-stone-50/90 backdrop-blur-md border-b border-stone-200 py-3'
                : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                {/* --- LOGO --- */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center rounded-sm transition-transform group-hover:scale-105">
                        <span className="font-serif font-bold text-xl italic">F</span>
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:opacity-70 transition-opacity">
                        Fabricanova
                    </span>
                </Link>

                {/* --- DESKTOP LINKS --- */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium hover:text-stone-900 transition-colors ${pathname === link.href ? 'text-stone-900 underline underline-offset-4' : 'text-stone-500'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* --- ACTIONS (LOGIC HERE) --- */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        // STATE: LOGGED IN
                        <>
                            <Link href="/profile" className="text-stone-500 hover:text-stone-900 transition-colors">
                                <User size={20} />
                            </Link>
                            <Link href="/studio" className="bg-stone-900 text-stone-50 px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-stone-800 flex items-center gap-2 shadow-lg shadow-stone-900/10 transition-all">
                                <LayoutDashboard size={14} /> Enter Studio
                            </Link>
                        </>
                    ) : (
                        // STATE: LOGGED OUT
                        <>
                            <Link href="/auth" className="text-stone-900 text-sm font-medium hover:underline">
                                Sign In
                            </Link>
                            <Link href="/auth" className="bg-stone-900 text-stone-50 px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-stone-800 flex items-center gap-2 transition-all">
                                <Sparkles size={14} /> Start Designing
                            </Link>
                        </>
                    )}
                </div>

                {/* --- MOBILE TOGGLE --- */}
                <button
                    className="md:hidden text-stone-900"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* --- MOBILE MENU --- */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-stone-50 border-b border-stone-200 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-serif font-medium text-stone-900"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-px bg-stone-200 my-2" />
                    {user ? (
                        <Link
                            href="/studio"
                            className="bg-stone-900 text-stone-50 px-5 py-3 rounded-sm text-center font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Enter Studio
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/auth"
                                className="text-stone-900 text-center font-medium hover:underline"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth"
                                className="bg-stone-900 text-stone-50 px-5 py-3 rounded-sm text-center font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Start Designing
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}