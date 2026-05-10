import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import FineIssueForm from '../../components/policeman/FineIssueForm';
import { MessageSquare, Loader2, CheckCircle } from 'lucide-react';

const PolicemanDashboard = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendMessage = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const sender_id = userStr ? JSON.parse(userStr).id : null;
      
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id, receiver_id: null, content })
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setContent(''); }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 mt-24 px-4 w-full max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Policeman Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FineIssueForm />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-maroon mb-4">Offence History (Live Linked)</h2>
              <p className="text-gray-500 text-sm">Fine records automatically attach to Central Database.</p>
            </div>

            <div className="bg-maroon p-6 rounded-3xl shadow-lg relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="relative z-10 flex flex-col gap-3">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" /> Support & Disputes
                </h2>
                <p className="text-white/70 text-sm mb-2">Report technical errors directly to the IT Administrator.</p>
                
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Describe your issue..."
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-skyYellow"
                  rows={4}
                />
                
                <button 
                  onClick={sendMessage} 
                  disabled={loading || success} 
                  className="w-full flex justify-center items-center px-4 py-2 mt-2 bg-skyYellow text-maroon-dark font-bold rounded-xl hover:bg-white transition-colors"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <CheckCircle className="w-5 h-5" /> : 'Send Issue to Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicemanDashboard;
