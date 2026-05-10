import { useState, useEffect } from 'react';
import { Loader2, Reply, Send } from 'lucide-react';

interface MessagePayload {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  status: string;
  created_at: string;
  sender: { full_name: string; role: string; nic?: string; badge_number?: string; phone_number?: string };
  receiver: { full_name: string; role: string; nic?: string; badge_number?: string; phone_number?: string };
}

const MessageCenter = () => {
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch admin messages. Using 'all' logic or user ID. 
  // Let's assume user.id string is grabbed from local storage.
  const userStr = localStorage.getItem('user');
  const userId = userStr ? JSON.parse(userStr).id : null;

  const fetchMessages = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${userId}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const handleReply = async (receiver_id: string) => {
    if (!replyContent.trim() || !userId) return;
    setSubmitting(true);
    try {
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: userId, receiver_id, content: replyContent })
      });
      setReplyOpen(null);
      setReplyContent('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-maroon" /></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Central Inboxes & Tickets</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wide mr-2 ${
                  msg.sender?.role === 'driver' ? 'bg-blue-100 text-blue-800' :
                  msg.sender?.role === 'policeman' ? 'bg-slate-200 text-slate-800' :
                  'bg-maroon text-white'
                }`}>
                  {msg.sender?.role || 'SYSTEM'}
                </span>
                <span className="font-bold text-sm text-gray-700">{msg.sender?.full_name || 'System Broadcast'}</span>
                {msg.sender && msg.sender.role !== 'admin' && (
                  <span className="text-xs text-gray-500 ml-2 font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {msg.sender.nic || msg.sender.badge_number} | {msg.sender.phone_number}
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-2">{new Date(msg.created_at).toLocaleString()}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 bg-white p-3 rounded-xl border border-gray-100">{msg.content}</p>

            {msg.sender_id !== userId && msg.sender?.role !== 'admin' && (
              <div className="mt-2">
                {replyOpen !== msg.id ? (
                  <button onClick={() => setReplyOpen(msg.id)} className="flex items-center gap-1 text-xs font-bold text-maroon hover:text-maroon-dark transition-colors">
                    <Reply className="w-4 h-4" /> Reply to {msg.sender?.role}
                  </button>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    <textarea 
                      className="w-full p-2 text-sm border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                      rows={2}
                      placeholder={`Draft reply to ${msg.sender?.full_name}...`}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button onClick={() => setReplyOpen(null)} className="px-3 py-1 font-medium text-gray-500 hover:text-gray-700">Cancel</button>
                      <button onClick={() => handleReply(msg.sender_id)} disabled={submitting} className="flex items-center gap-1.5 px-3 py-1.5 bg-maroon text-white font-bold rounded hover:bg-maroon-dark shadow-sm">
                        {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            No system or inbound messages found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;
