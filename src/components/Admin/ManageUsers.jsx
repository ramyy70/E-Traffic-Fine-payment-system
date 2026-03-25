import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader, Trash2, Shield, Car, User } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            setError(err.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently delete this user?')) {
            return;
        }

        try {
            // Note: Deleting from auth schema directly isn't allowed for client, 
            // but deleting from the public 'users' table works if RLS allows it, 
            // or an RPC handles it. For safety without backend we delete from 'users'
            const { error } = await supabase.from('users').delete().eq('id', userId);
            
            if (error) {
                // If RLS blocks hard delete, maybe we can run the user out of active via update
                console.error("Delete error:", error);
                
                // Fallback attempt: soft delete via is_active
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ is_active: false })
                    .eq('id', userId);
                    
                if (updateError) throw updateError;
            }
            
            // Refresh list
            fetchUsers();
        } catch (err) {
            alert('Error deleting user: ' + err.message);
        }
    };

    const getRoleIcon = (role) => {
        if (role === 'admin') return <Shield className="h-4 w-4 text-purple-500" />;
        if (role === 'police') return <Shield className="h-4 w-4 text-blue-500" />;
        if (role === 'driver') return <Car className="h-4 w-4 text-green-500" />;
        return <User className="h-4 w-4 text-gray-500" />;
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex justify-center flex-col items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-cyan-500 mb-4" />
                <p className="text-sm text-slate-500">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#0b2447]">User Management</h3>
                <button 
                    onClick={fetchUsers} 
                    className="text-sm text-cyan-500 font-semibold hover:text-cyan-600"
                >
                    Refresh List
                </button>
            </div>
            
            {error && (
                <div className="p-4 bg-red-50 border-b border-red-100 text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Phone</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">{u.full_name || 'N/A'}</span>
                                        <span className="text-xs text-slate-500">{u.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getRoleIcon(u.user_type)}
                                        <span className="capitalize">{u.user_type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{u.phone_number || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        u.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {u.is_active !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleDelete(u.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Delete User"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                    No users found in the system.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
