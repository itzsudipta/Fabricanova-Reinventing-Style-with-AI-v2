'use client';

import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-stone-200 pt-20 pb-12 font-sans text-stone-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center rounded-lg">
                                <span className="font-serif font-bold italic">F</span>
                            </div>
                            <span className="font-serif text-xl font-bold text-stone-900">Fabricanova</span>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed mb-6">
                             Kolkata • West Bengal <br />
                            Est. 2024
                        </p>
                        <div className="flex gap-4 opacity-60">
                            <Twitter size={20} className="hover:text-purple-600 transition-colors cursor-pointer" />
                            <Instagram size={20} className="hover:text-purple-600 transition-colors cursor-pointer" />
                            <Linkedin size={20} className="hover:text-purple-600 transition-colors cursor-pointer" />
                        </div>
                    </div>

                    {/* Studio Links */}
                    <div>
                        <h4 className="font-bold text-stone-900 mb-6">Studio</h4>
                        <ul className="space-y-4 text-sm text-stone-500">
                            <li><Link href="/studio" className="hover:text-stone-900 transition-colors">Generative Canvas</Link></li>
                            <li><Link href="#" className="hover:text-stone-900 transition-colors">Texture Library</Link></li>
                            <li><Link href="#" className="hover:text-stone-900 transition-colors">Tech Packs</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-bold text-stone-900 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-stone-500">
                            <li><Link href="/team" className="hover:text-stone-900 transition-colors">The Team</Link></li>
                            <li><Link href="/pricing" className="hover:text-stone-900 transition-colors">Membership</Link></li>
                            <li><Link href="#" className="hover:text-stone-900 transition-colors">Manifesto</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-stone-900 mb-6">Newsletter</h4>
                        <div className="flex border-b border-stone-300 pb-2">
                            <input
                                type="email"
                                placeholder="email@domain.com"
                                className="bg-transparent w-full outline-none text-stone-900 placeholder:text-stone-300 text-sm"
                            />
                            <button className="text-stone-900 font-bold text-xs uppercase hover:text-purple-600 transition-colors">Join</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-stone-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 font-medium uppercase tracking-wider">
                    <p>© 2026 Fabricanova Inc.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-stone-900 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-stone-900 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-stone-900 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}