import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleSuspend = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}/suspend`, { method: 'PUT' });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to update suspension status', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Search by ID, Name or Role..." className="px-4 py-2 border border-gray-300 rounded-xl w-64 focus:border-maroon focus:ring-maroon" />
          <select className="px-4 py-2 border border-gray-300 rounded-xl bg-white">
            <option value="all">All Roles</option>
            <option value="driver">Drivers</option>
            <option value="policeman">Policemen</option>
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
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact</th>
                <th className="p-4">ID/Badge</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium">{user.full_name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'driver' ? 'bg-blue-100 text-blue-700' : user.role === 'admin' ? 'bg-black text-white' : 'bg-maroon/10 text-maroon'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4 text-sm font-mono">{user.role === 'driver' ? user.nic : user.badge_number || 'N/A'}</td>
                  <td className={`p-4 text-sm font-bold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{user.status}</td>
                  <td className="p-4 text-sm">
                    <button className="text-blue-600 hover:underline mr-3">Edit</button>
                    {user.role !== 'admin' && (
                      <button onClick={() => handleSuspend(user.id)} className={`${user.status === 'Active' ? 'text-red-600' : 'text-green-600'} hover:underline font-bold`}>
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500 w-full col-span-full">No users active.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
