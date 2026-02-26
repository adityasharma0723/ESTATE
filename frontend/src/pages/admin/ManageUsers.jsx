import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import { HiTrash, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/users', { params: { role: 'user', search, limit: 50 } });
            setUsers(data.users);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, [search]);

    const handleRoleChange = async (id, role) => {
        try {
            await API.put(`/users/${id}/role`, { role });
            toast.success('Role updated');
            fetchUsers();
        } catch { toast.error('Failed to update role'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await API.delete(`/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch { toast.error('Failed to delete'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-dark">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-dark/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{u.name?.charAt(0)}</div>
                                            <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-dark-text">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-dark border-0 focus:outline-none">
                                            <option value="user">User</option>
                                            <option value="agent">Agent</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-dark-text">{formatDate(u.createdAt)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><HiTrash className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
