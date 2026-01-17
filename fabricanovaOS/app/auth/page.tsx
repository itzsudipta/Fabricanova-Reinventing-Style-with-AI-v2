'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Github, Loader2, AlertCircle, Chrome, ArrowRight, CheckCircle2, Box } from 'lucide-react';

export default function AuthPage() {
    const router = useRouter();

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
    // LOGIN
    const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    });
    if (error) throw error;
    
    // Redirect handled by middleware or router
    router.push('/studio');
    router.refresh(); 

} else {
    // SIGN UP
    const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                // This 'full_name' is what the Trigger in Step 1 looks for!
                full_name: formData.email.split('@')[0], 
            },
            // This URL must match your site URL in Supabase Dashboard -> Auth -> URL Configuration
            emailRedirectTo: `${window.location.origin}/auth/callback`, 
        },
    });
    if (error) throw error;
    setMessage("Account created! Check your email.");
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
        <div className="min-h-screen flex w-full bg-white font-sans text-zinc-900 selection:bg-black selection:text-white">
            
            {/* LEFT PANEL: Dark Aesthetic (Desktop) */}
            <div className="hidden lg:flex w-1/2 bg-zinc-950 relative overflow-hidden flex-col justify-between p-16 text-white border-r border-zinc-900">
                {/* Texture/Grid Background */}
                <div className="absolute inset-0 z-0 opacity-20" 
                     style={{ 
                         backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
                         backgroundSize: '40px 40px' 
                     }}>
                </div>
                
                {/* Subtle Radial Gradient */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-zinc-800 rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-10 h-10 border border-zinc-700 bg-zinc-900 flex items-center justify-center rounded-lg shadow-2xl">
                            <Box size={20} className="text-white" />
                        </div>
                        <span className="font-serif text-2xl font-medium tracking-tight">Fabricanova</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="font-serif text-5xl leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
                        The minimal standard for digital design.
                    </h2>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed border-l-2 border-zinc-800 pl-6">
                        Join a community of 15,000+ designers pushing the boundaries of what is possible with simple tools.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Est. 2024</span>
                    <span className="w-12 h-[1px] bg-zinc-800"></span>
                    <span>Designed in Tokyo</span>
                </div>
            </div>

            {/* RIGHT PANEL: Clean White Workspace */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                
                {/* Mobile Header */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <Box size={24} className="text-black" />
                        <span className="font-serif text-xl font-bold">Fabricanova</span>
                    </Link>
                </div>

                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-700">
                    
                    <div className="mb-10 pt-8 lg:pt-0">
                        <h1 className="font-serif text-3xl md:text-4xl text-black mb-3">
                            {isLogin ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-zinc-500">
                            {isLogin 
                                ? 'Please enter your details.' 
                                : 'Start your 14-day free trial.'}
                        </p>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('github')}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all text-sm font-medium text-zinc-700"
                        >
                            <Github size={18} />
                            GitHub
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all text-sm font-medium text-zinc-700"
                        >
                            <Chrome size={18} />
                            Google
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-white px-3 text-zinc-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Alerts (Kept minimal) */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500 text-red-600 text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-3 bg-zinc-50 border-l-2 border-black text-zinc-800 text-sm flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full p-3 bg-transparent border border-zinc-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-zinc-300 text-black text-sm"
                            />
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    Password
                                </label>
                                {isLogin && (
                                    <button type="button" className="text-xs text-zinc-400 hover:text-black transition-colors hover:underline">
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
                                className="w-full p-3 bg-transparent border border-zinc-200 rounded-lg outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-zinc-300 text-black text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white h-11 rounded-lg font-medium hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-xl shadow-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Wait...
                                </>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-zinc-100 pt-6">
                        <p className="text-sm text-zinc-500">
                            {isLogin ? "New here? " : "Already a member? "}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setMessage('');
                                    setFormData({ email: '', password: '' });
                                }}
                                className="font-bold text-black hover:underline"
                            >
                                {isLogin ? 'Create an account' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}