'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// 1. UPDATE IMPORT
import { createBrowserClient } from '@supabase/ssr';
import { Github, Loader2, AlertCircle, Chrome } from 'lucide-react';

export default function AuthPage() {
    const router = useRouter();

    // 2. UPDATE INITIALIZATION
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // UI State
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setMessage('');
    };

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // --- LOGIN LOGIC ---
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) throw error;

                router.push('/studio');
                router.refresh();
            } else {
                // --- SIGNUP LOGIC ---
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.email.split('@')[0],
                            avatar_url: '',
                        },
                        // Ensure this matches your site URL in Supabase Dashboard -> Auth -> URL Configuration
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;

                setMessage("Account created! Check your email to confirm.");
                setIsLoading(false);
                return;
            }

        } catch (err: any) {
            setError(err.message || "Authentication failed.");
        } finally {
            if (isLogin) setIsLoading(false);
        }
    };

    // Handle Social Login
    const handleSocialLogin = async (provider: 'github' | 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-white selection:bg-stone-900 selection:text-white">
            {/* Visual Side (Left) */}
            <div className="hidden lg:block w-1/2 bg-stone-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/5" />
                <div className="absolute top-0 right-0 w-full h-full opacity-30"
                    style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>
                <div className="absolute bottom-20 left-12 max-w-md z-10">
                    <div className="w-12 h-1 bg-stone-900 mb-6"></div>
                    <h2 className="font-serif text-5xl text-stone-900 mb-6 leading-tight">
                        Design without <br /> limits.
                    </h2>
                    <p className="text-lg text-stone-600 font-light">
                        Join 15,000+ fashion designers utilizing Fabricanova to weave the future.
                    </p>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 animate-in fade-in slide-in-from-right-10 duration-700">
                <div className="w-full max-w-sm">

                    <Link href="/" className="mb-10 inline-block cursor-pointer hover:opacity-70 transition-opacity">
                        <span className="font-serif text-2xl font-bold text-stone-900">Fabricanova</span>
                    </Link>

                    <h3 className="text-2xl font-semibold text-stone-900 mb-2">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h3>
                    <p className="text-stone-500 mb-8 text-sm">
                        {isLogin
                            ? 'Enter your details to access your studio.'
                            : 'Start your 14-day free trial today.'}
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded text-green-700 text-sm flex items-center gap-2">
                            <Chrome size={16} />
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full p-3 bg-white border border-stone-200 rounded text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all placeholder:text-stone-300 text-stone-900"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                                    Password
                                </label>
                                {isLogin && (
                                    <button type="button" className="text-xs text-stone-400 hover:text-stone-900 hover:underline transition-colors">
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full p-3 bg-white border border-stone-200 rounded text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all placeholder:text-stone-300 text-stone-900"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="block w-full bg-stone-900 text-white py-3 rounded font-medium hover:bg-stone-800 active:scale-[0.98] transition-all shadow-lg shadow-stone-900/10 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                            <span className="bg-white px-3 text-stone-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('github')}
                            className="flex items-center justify-center gap-2 p-2.5 border border-stone-200 rounded hover:bg-stone-50 hover:border-stone-300 transition-all text-sm font-medium text-stone-700"
                        >
                            <Github size={18} /> GitHub
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-2 p-2.5 border border-stone-200 rounded hover:bg-stone-50 hover:border-stone-300 transition-all text-sm font-medium text-stone-700"
                        >
                            <Chrome size={18} /> Google
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-stone-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setMessage('');
                                setFormData({ email: '', password: '' });
                            }}
                            className="font-bold text-stone-900 hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}