import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import AdminStats from '../../components/admin/AdminStats';
import UserManagement from '../../components/admin/UserManagement';
import FineManagement from '../../components/admin/FineManagement';
import MessageCenter from '../../components/admin/MessageCenter';
import { Users, FileText, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'fines' | 'messages'>('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 mt-24 px-4 w-full max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Control Panel</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-maroon text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === 'users' ? 'bg-maroon text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <Users className="w-4 h-4" /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('fines')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === 'fines' ? 'bg-maroon text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <FileText className="w-4 h-4" /> Fine Records
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === 'messages' ? 'bg-maroon text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
          >
            <MessageSquare className="w-4 h-4" /> System Messages
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[500px]">
          {activeTab === 'overview' && <AdminStats />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'fines' && <FineManagement />}
          {activeTab === 'messages' && <MessageCenter />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
