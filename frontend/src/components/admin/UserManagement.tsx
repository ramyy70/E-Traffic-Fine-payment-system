import { useEffect, useState } from 'react';
import { Loader2, X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActiveUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone_number: string;
  nic: string;
  badge_number: string;
  status: string;
}

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Edit modal state
  const [editingUser, setEditingUser] = useState<ActiveUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query ||
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.nic && user.nic.toLowerCase().includes(query)) ||
      (user.badge_number && user.badge_number.toLowerCase().includes(query)) ||
      user.role.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user from DB
  const handleDelete = async (userId: string) => {
    if (!window.confirm(t('admin.confirmDeleteUser', 'Are you sure you want to completely delete this user?'))) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user', err);
      alert('An unexpected error occurred while deleting the user.');
    }
  };

  // Open edit modal
  const openEdit = (user: ActiveUser) => {
    setEditingUser(user);
    setEditName(user.full_name);
    setEditPhone(user.phone_number);
    setEditError('');
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setEditSaving(true);
    setEditError('');
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editingUser.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: editName, phone_number: editPhone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      // Update local state so change is instantly visible
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id
            ? { ...u, full_name: editName, phone_number: editPhone }
            : u
        )
      );
      setEditingUser(null);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('admin.userManagement')}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('admin.searchUser')}
            className="px-4 py-2 border border-gray-300 rounded-xl w-64 focus:border-maroon focus:ring-maroon"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white"
          >
            <option value="all">{t('admin.allRoles')}</option>
            <option value="driver">{t('admin.drivers')}</option>
            <option value="policeman">{t('admin.policemen')}</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-maroon" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-2xl">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-sm">
              <tr>
                <th className="p-4">{t('admin.name')}</th>
                <th className="p-4">{t('admin.role')}</th>
                <th className="p-4">{t('admin.contact')}</th>
                <th className="p-4">{t('admin.idBadge')}</th>
                <th className="p-4">{t('admin.status')}</th>
                <th className="p-4">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredUsers.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium">{user.full_name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      user.role === 'driver' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'admin' ? 'bg-black text-white' :
                      'bg-maroon/10 text-maroon'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4 text-sm font-mono">
                    {user.role === 'driver' ? user.nic : user.badge_number || 'N/A'}
                  </td>
                  <td className="p-4 text-sm font-bold">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm flex items-center gap-3">
                    <button
                      onClick={() => openEdit(user)}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
                    >
                      {t('admin.edit')}
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 rounded-lg font-semibold text-xs transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        {t('admin.delete', 'Delete')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500 w-full">{t('admin.noUsers')}</div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Edit User</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* User Info Banner */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5">
              <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center text-white font-bold text-sm">
                {editingUser.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">{editingUser.email}</p>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  editingUser.role === 'driver' ? 'bg-blue-100 text-blue-700' :
                  editingUser.role === 'admin' ? 'bg-black text-white' :
                  'bg-maroon/10 text-maroon'
                }`}>
                  {editingUser.role.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-maroon text-sm"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-maroon text-sm"
                  placeholder="Phone number"
                />
              </div>
            </div>

            {editError && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">{editError}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="flex-1 py-2.5 bg-maroon text-white rounded-xl text-sm font-semibold hover:bg-maroon/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
