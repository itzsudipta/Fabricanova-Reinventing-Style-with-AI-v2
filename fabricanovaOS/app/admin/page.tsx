'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
    Shield, Users, Search, MoreHorizontal,
    ArrowUpRight, AlertCircle, CheckCircle, Lock
} from 'lucide-react';
import Navbar from '../../component/Navbar';

export default function AdminPage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const checkAdminAndFetch = async () => {
            // 1. Get Current User
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/auth');
                return;
            }

            // 2. Check Role (Security)
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role !== 'super_admin') {
                router.push('/'); // Kick them out if not admin
                return;
            }

            // 3. Fetch All Users (Admin Action)
            const { data: users, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (users) setAllUsers(users);
            setLoading(false);
        };

        checkAdminAndFetch();
    }, [supabase, router]);

    // Filter Logic
    const filteredUsers = allUsers.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-stone-400 gap-4">
            <Lock size={32} className="animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-widest">Verifying Clearance Level...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={16} className="text-emerald-600" />
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">
                                Admin Console
                            </span>
                        </div>
                        <h1 className="font-serif text-4xl text-stone-900">
                            The Control Room.
                        </h1>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-6 mt-6 md:mt-0">
                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                            <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider mb-1">Total Users</p>
                            <p className="text-2xl font-serif">{allUsers.length}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                            <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider mb-1">Active Today</p>
                            <p className="text-2xl font-serif">1</p>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                        <div className="relative w-full max-w-md">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search by email or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 transition-colors"
                            />
                        </div>
                        <button className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900">
                            Export CSV
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                    <th className="px-6 py-4">User Identity</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-stone-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-serif font-bold">
                                                    {user.full_name ? user.full_name[0] : user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-stone-900">
                                                        {user.full_name || "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-stone-500 font-mono">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${user.role === 'super_admin'
                                                    ? 'bg-stone-900 text-white border-stone-900'
                                                    : 'bg-white text-stone-500 border-stone-200'
                                                }`}>
                                                {user.role === 'super_admin' && <Shield size={10} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span className="text-xs font-medium text-stone-600">Verified</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-stone-500 font-mono">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-stone-200 rounded text-stone-400 hover:text-stone-900 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination / Footer */}
                    <div className="p-4 border-t border-stone-100 bg-stone-50/30 text-xs text-stone-400 flex justify-between items-center">
                        <span>Showing {filteredUsers.length} results</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-stone-200 rounded bg-white hover:bg-stone-50">Prev</button>
                            <button className="px-3 py-1 border border-stone-200 rounded bg-white hover:bg-stone-50">Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}