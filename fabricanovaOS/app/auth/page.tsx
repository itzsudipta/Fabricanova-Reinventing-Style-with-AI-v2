'use client';
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export default function AuthPage() {
    return (
        <div className="min-h-screen flex bg-white">
            {/* Visual Side */}
            <div className="hidden lg:block w-1/2 bg-stone-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/5" />
                <div className="absolute bottom-20 left-12 max-w-md">
                    <h2 className="font-serif text-5xl text-stone-900 mb-6">Design without limits.</h2>
                    <p className="text-lg text-stone-600">Join 15,000+ fashion designers utilizing Fabricanova.</p>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
                <div className="w-full max-w-sm">
                    <Link href="/" className="mb-10 block cursor-pointer">
                        <span className="font-serif text-2xl font-bold text-stone-900">Fabricanova</span>
                    </Link>

                    <h3 className="text-2xl font-semibold mb-2">Welcome back</h3>
                    <p className="text-stone-500 mb-8 text-sm">Enter your details to access your studio.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1.5">Email</label>
                            <input type="email" className="w-full p-3 bg-stone-50 border border-stone-200 rounded text-sm outline-none focus:border-stone-900 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1.5">Password</label>
                            <input type="password" className="w-full p-3 bg-stone-50 border border-stone-200 rounded text-sm outline-none focus:border-stone-900 transition-colors" />
                        </div>

                        <Link href="/studio" className="block w-full text-center bg-stone-900 text-white py-3 rounded font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10">
                            Sign In
                        </Link>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-stone-400">Or continue with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 p-2.5 border border-stone-200 rounded hover:bg-stone-50 transition-colors text-sm font-medium">
                                <Github size={16} /> GitHub
                            </button>
                            <button className="flex items-center justify-center gap-2 p-2.5 border border-stone-200 rounded hover:bg-stone-50 transition-colors text-sm font-medium">
                                <Twitter size={16} /> Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}