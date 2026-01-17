'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import {
    User, Loader2, Shield, LogOut, Chrome, LayoutGrid, Calendar, 
    Download, Smartphone, Zap, Settings, MapPin, Camera
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
    const [designs, setDesigns] = useState<any[]>([]);

    // Mock Data for UI visualization
    const usageStats = {
        credits: 75,
        limit: 100,
        plan: "Pro Artisan",
        renewal: "Feb 1, 2026"
    };

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/auth'); return; }
            setUser(user);

            // 1. Fetch Profile Details
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            // 2. Fetch Design History (Using the new user_id column)
            const { data: designData, error } = await supabase
                .from('designs')
                .select('*')
                .eq('user_id', user.id) 
                .order('created_at', { ascending: false });

            if (error) console.error("Error fetching designs:", error);
            if (designData) setDesigns(designData);
            
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
            <Loader2 className="animate-spin text-stone-900 w-8 h-8" />
        </div>
    );

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
            <Navbar user={user} />

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-20">
                
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >

                    {/* === LEFT COLUMN: PROFILE & SESSIONS (4/12) === */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* 1. IDENTITY CARD */}
                        <motion.div variants={item} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-stone-100 to-white border-b border-stone-50"></div>
                            
                            <div className="relative z-10 text-center mt-6">
                                <div className="relative inline-block mb-4">
                                    <div className="w-28 h-28 rounded-full border-4 border-white bg-stone-200 shadow-xl overflow-hidden flex items-center justify-center">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                                        ) : (
                                            <span className="text-3xl font-serif text-stone-500 font-bold">
                                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <button className="absolute bottom-1 right-1 p-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-colors shadow-md">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                
                                <h2 className="font-serif text-2xl font-bold text-stone-900">{profile?.full_name || "Artisan Designer"}</h2>
                                <p className="text-stone-500 text-xs font-mono mt-1 mb-6">{user.email}</p>

                                <div className="flex gap-2 justify-center">
                                    <button className="flex-1 py-2.5 px-4 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10">
                                        Edit Profile
                                    </button>
                                    <button className="p-2.5 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-stone-600">
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Member Since</span>
                                    <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-stone-500">Account Type</span>
                                    <span className="font-medium capitalize">{profile?.role?.replace('_', ' ') || 'Standard'}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. SECURITY & SESSIONS */}
                        <motion.div variants={item} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 flex items-center gap-2">
                                <Shield size={14} /> Active Sessions
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-100 rounded-xl">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-stone-900 shadow-sm border border-stone-100">
                                        <Chrome size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-stone-900 truncate">Current Session</p>
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            Active Now
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSignOut} className="w-full mt-6 py-3 border border-red-100 bg-red-50/50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <LogOut size={14} /> Sign Out
                            </button>
                        </motion.div>
                    </div>


                    {/* === RIGHT COLUMN: STATS & GALLERY (8/12) === */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* 3. USAGE STATS ROW */}
                        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Credits Card */}
                            <div className="bg-stone-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-stone-900/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-stone-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                                
                                <div className="relative z-10 flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">AI Credits</p>
                                        <h3 className="font-serif text-3xl">{usageStats.credits} <span className="text-lg text-stone-500 font-sans">/ {usageStats.limit}</span></h3>
                                    </div>
                                    <div className="p-2 bg-stone-800 rounded-lg text-yellow-400">
                                        <Zap size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-white rounded-full" style={{ width: `${(usageStats.credits / usageStats.limit) * 100}%` }}></div>
                                </div>
                                <p className="text-xs text-stone-400 text-right">Resets {usageStats.renewal}</p>
                            </div>

                            {/* Plan Card */}
                            <div className="bg-white border border-stone-200 rounded-3xl p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Current Plan</p>
                                        <h3 className="font-serif text-2xl text-stone-900">{usageStats.plan}</h3>
                                    </div>
                                    <div className="p-2 bg-stone-50 rounded-lg text-stone-900">
                                        <LayoutGrid size={20} />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button className="text-xs font-bold border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                                        Upgrade
                                    </button>
                                </div>
                            </div>
                        </motion.div>


                        {/* 4. DESIGN ARCHIVE (Gallery) */}
                        <motion.div variants={item}>
                            <div className="flex items-center justify-between mb-6 mt-8">
                                <h2 className="font-serif text-2xl text-stone-900">Collection Archive</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{designs.length} Designs</span>
                                    <button onClick={() => router.push('/studio')} className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors">
                                        + New
                                    </button>
                                </div>
                            </div>

                            {designs.length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 text-stone-400">
                                        <LayoutGrid size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-1">No designs yet</h3>
                                    <p className="text-stone-500 mb-6 text-sm max-w-xs">Your portfolio is waiting. Jump into the studio to create your first piece.</p>
                                    <button onClick={() => router.push('/studio')} className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors">
                                        Open Studio
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {designs.map((design) => (
                                        <div key={design.id} className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            
                                            {/* Image & Overlay */}
                                            <div className="aspect-[3/4] relative overflow-hidden bg-stone-100">
                                                <img 
                                                    src={design.image_url} 
                                                    alt={design.prompt} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                />
                                                
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                    <a href={design.image_url} download target="_blank" className="w-full py-2 bg-white text-stone-900 text-xs font-bold uppercase tracking-wider rounded-lg text-center flex items-center justify-center gap-2 hover:bg-stone-100 transition-colors">
                                                        <Download size={14} /> Download
                                                    </a>
                                                </div>

                                                {/* Top Badges (Swatch / Sketch) */}
                                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                    {design.swatch_url && (
                                                        <div className="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden bg-white" title="Fabric Swatch">
                                                            <img src={design.swatch_url} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    {design.sketch_url && (
                                                        <div className="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden bg-white p-1" title="Sketch">
                                                            <img src={design.sketch_url} className="w-full h-full object-contain" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Card Details */}
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-stone-900 text-sm truncate flex-1 pr-2">Generated Look</h4>
                                                    <span className="text-[10px] text-stone-400 font-mono pt-0.5">
                                                        {new Date(design.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-xs text-stone-500 line-clamp-2 mb-4 h-8 leading-relaxed">
                                                    {design.prompt}
                                                </p>
                                                
                                                {/* Footer: Palette */}
                                                <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                                                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Palette</span>
                                                    {design.palette && (
                                                        <div className="flex -space-x-1">
                                                            {(typeof design.palette === 'string' ? JSON.parse(design.palette) : design.palette).slice(0, 5).map((color: string, i: number) => (
                                                                <div key={i} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                    </div>
                </motion.div>
            </main>
        </div>
    );
}