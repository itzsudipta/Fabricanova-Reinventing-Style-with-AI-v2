'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
    Shield, Search, MoreHorizontal, AlertCircle,
    CheckCircle, Lock, Trash2, RefreshCcw, ShieldAlert,
    UserCog
} from 'lucide-react';
import Navbar from '../../component/Navbar';

export default function AdminPage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // Track specific ID being modified
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Fetch Data Function
    const fetchUsers = async () => {
        const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching users:", error);
            setErrorMsg("Failed to load users. Check RLS policies.");
        } else {
            setAllUsers(users || []);
        }
    };

    useEffect(() => {
        const checkAdminAndFetch = async () => {
            try {
                // 1. Get Current User
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/auth');
                    return;
                }

                // 2. CHECK: Is this the Master Admin?
                // We hardcode your email here to bypass database errors
                const isMasterAdmin = user.email === 'sudipta@fabricanova.com';

                // 3. Check Database Role (for other admins)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                // 4. Security Gate
                // If not Master Admin AND not Database Admin -> Kick them out
                if (!isMasterAdmin && profile?.role !== 'super_admin') {
                    console.warn("Unauthorized access attempt by:", user.email);
                    router.push('/');
                    return;
                }

                // If we get here, you are allowed.
                setCurrentUserRole('super_admin'); // Force UI to show admin view

                // 5. Fetch All Users
                await fetchUsers();
                setLoading(false);

            } catch (err) {
                console.error("Admin check failed", err);
                router.push('/');
            }
        };

        checkAdminAndFetch();
    }, [supabase, router]);

    // --- ACTIONS ---

    // 1. Toggle Admin Role
    const handleToggleRole = async (userId: string, currentRole: string) => {
        setActionLoading(userId);
        const newRole = currentRole === 'super_admin' ? 'user' : 'super_admin';

        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            alert("Error updating role: " + error.message);
        } else {
            // Update local state to reflect change immediately
            setAllUsers(allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
        setActionLoading(null);
    };

    // 2. Delete User Profile
    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure? This deletes their profile data. (Note: Auth account requires server-side deletion).")) return;

        setActionLoading(userId);

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) {
            alert("Error deleting user: " + error.message);
        } else {
            // Remove from local list
            setAllUsers(allUsers.filter(u => u.id !== userId));
        }
        setActionLoading(null);
    };

    // Filter Logic
    const filteredUsers = allUsers.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm min-w-[140px]">
                            <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider mb-1">Total Users</p>
                            <p className="text-2xl font-serif">{allUsers.length}</p>
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm hover:bg-stone-50 transition-colors flex flex-col items-center justify-center min-w-[80px]"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={20} className="text-stone-400" />
                        </button>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
                        <AlertCircle size={20} />
                        {errorMsg}
                    </div>
                )}

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
                        <div className="text-xs font-mono text-stone-400">
                            MODE: <span className="text-stone-900 font-bold">SUPER_ADMIN</span>
                        </div>
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
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs
                                                    ${user.role === 'super_admin' ? 'bg-stone-900' : 'bg-stone-300'}`}>
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
                                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                                : 'bg-stone-100 text-stone-500 border-stone-200'
                                                }`}>
                                                {user.role === 'super_admin' && <ShieldAlert size={10} />}
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span className="text-xs font-medium text-stone-600">Active</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-stone-500 font-mono">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">

                                                {/* Edit Role Button */}
                                                <button
                                                    onClick={() => handleToggleRole(user.id, user.role)}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 hover:bg-stone-200 rounded text-stone-500 hover:text-stone-900 transition-colors"
                                                    title={user.role === 'super_admin' ? "Demote to User" : "Promote to Admin"}
                                                >
                                                    {actionLoading === user.id ? (
                                                        <RefreshCcw size={16} className="animate-spin" />
                                                    ) : (
                                                        <UserCog size={16} />
                                                    )}
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 hover:bg-red-50 rounded text-stone-400 hover:text-red-600 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-stone-100 bg-stone-50/30 text-xs text-stone-400 flex justify-between items-center">
                        <span>Showing {filteredUsers.length} results</span>
                    </div>

                </div>
            </div>
        </div>
    );
}