'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import {
    User, Camera, Loader2, Shield,
    Zap, Clock, Smartphone, LogOut,Chrome
} from 'lucide-react';
import Navbar from '../../component/Navbar';

export default function ProfilePage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    // Mock Usage Data (In real app, fetch this from DB)
    const usageStats = {
        credits: 75,
        limit: 100,
        generations: 342,
        plan: "Pro Artisan"
    };

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth');
                return;
            }
            setUser(user);

            // Fetch Profile Data
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(data);
            setLoading(false);
        };
        getData();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <Loader2 className="animate-spin text-stone-400" />
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            <Navbar user={user} />

            <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">

                {/* Header Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 border-b border-stone-200 pb-6 flex justify-between items-end"
                >
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-stone-400 block mb-2">
                            Identification
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl text-stone-900">
                            Atelier Pass.
                        </h1>
                    </div>
                    {profile?.role === 'super_admin' && (
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Shield size={14} /> Super Admin Access
                        </div>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COL: ID CARD */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white border border-stone-200 rounded-[2rem] p-8 text-center relative overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-stone-100 border-b border-stone-100" />

                            {/* Avatar */}
                            <div className="relative inline-block mt-4 mb-6">
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-stone-200 shadow-lg flex items-center justify-center overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-serif text-4xl text-stone-400 italic">
                                            {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-colors shadow-lg">
                                    <Camera size={16} />
                                </button>
                            </div>

                            <h2 className="font-serif text-2xl font-bold mb-1">
                                {profile?.full_name || "Designer"}
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">
                                {profile?.role?.replace('_', ' ')}
                            </p>

                            <div className="space-y-4 text-left border-t border-stone-100 pt-6">
                                <div>
                                    <label className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Email</label>
                                    <p className="font-mono text-sm">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Member Since</label>
                                    <p className="font-mono text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Status</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        <span className="text-sm font-medium text-emerald-600">Active Session</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="mt-6 w-full py-4 border border-red-100 bg-red-50/50 text-red-600 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </motion.div>


                    {/* RIGHT COL: USAGE & SETTINGS */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Usage Meter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-stone-900 text-stone-50 rounded-[2rem] p-8 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="font-serif text-2xl mb-1">Monthly Credits</h3>
                                    <p className="text-stone-400 text-sm">Resets on Feb 1, 2026</p>
                                </div>
                                <div className="p-3 bg-stone-800 rounded-full">
                                    <Zap size={20} className="text-yellow-400" />
                                </div>
                            </div>

                            {/* Progress Bar styled as measuring tape */}
                            <div className="relative h-12 bg-stone-800 rounded-lg overflow-hidden mb-4 border border-stone-700">
                                <div
                                    className="absolute top-0 left-0 h-full bg-stone-100 transition-all duration-1000 ease-out"
                                    style={{ width: `${(usageStats.credits / usageStats.limit) * 100}%` }}
                                >
                                    {/* Tick marks pattern */}
                                    <div className="w-full h-full opacity-20"
                                        style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 100%' }}>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-between px-4 font-mono text-sm mix-blend-difference text-white font-bold">
                                    <span>0</span>
                                    <span>{usageStats.credits} / {usageStats.limit}</span>
                                </div>
                            </div>

                            <p className="text-xs text-stone-400 text-center uppercase tracking-widest">
                                {usageStats.limit - usageStats.credits} Credits Remaining
                            </p>
                        </motion.div>

                        {/* 2. Login History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white border border-stone-200 rounded-[2rem] p-8"
                        >
                            <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                                <Smartphone size={20} className="text-stone-400" />
                                Login History
                            </h3>

                            <div className="space-y-4">
                                {/* Current Device */}
                                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-stone-200 text-stone-400">
                                            <Chrome size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-stone-900">Chrome on Windows</p>
                                            <p className="text-xs text-stone-500">Paris, France • Current Session</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                </div>

                                {/* Previous Session */}
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-100 opacity-60">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center border border-stone-200 text-stone-400">
                                            <Smartphone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-stone-900">Safari on iPhone</p>
                                            <p className="text-xs text-stone-500">2 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    );
}