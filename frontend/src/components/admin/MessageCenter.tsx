import { useState, useEffect } from 'react';
import { Loader2, Reply, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MessagePayload {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  status: string;
  created_at: string;
  sender: { full_name: string; role: string; user_type?: string; nic?: string; badge_number?: string; phone_number?: string };
  receiver: { full_name: string; role: string; user_type?: string; nic?: string; badge_number?: string; phone_number?: string };
}

const MessageCenter = () => {
  const { t } = useTranslation();
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
        body: JSON.stringify({ sender_id: userId, receiver_id, content: replyContent, sender_role: 'admin' })
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('admin.centralInboxes')}</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wide mr-2 ${
                  msg.content.startsWith('[COMPLAINT]') ? 'bg-red-600 text-white' :
                  (msg.sender?.role === 'driver' || msg.sender?.user_type === 'driver') ? 'bg-blue-100 text-blue-800' :
                  (msg.sender?.role === 'policeman' || msg.sender?.user_type === 'policeman') ? 'bg-slate-200 text-slate-800' :
                  'bg-maroon text-white'
                }`}>
                  {msg.content.startsWith('[COMPLAINT]') ? 'COMPLAINT' : (msg.sender?.role || msg.sender?.user_type || 'SYSTEM')}
                </span>
                <span className="font-bold text-sm text-gray-700">{msg.sender?.full_name || t('admin.systemBroadcast')}</span>
                {msg.sender && msg.sender.role !== 'admin' && (
                  <span className="text-xs text-gray-500 ml-2 font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {msg.sender.nic || msg.sender.badge_number} | {msg.sender.phone_number}
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-2">{new Date(msg.created_at).toLocaleString()}</span>
              </div>
            </div>
            
            {msg.content.startsWith('[COMPLAINT]') ? (
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mb-3">
                <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                  <div>
                    <span className="font-bold text-red-800 uppercase block mb-1">Fine ID</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border border-red-100">{msg.content.split(' | ').find(p => p.startsWith('Fine ID: '))?.replace('Fine ID: ', '') || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-800 uppercase block mb-1">Reason</span>
                    <span className="bg-white px-2 py-1 rounded border border-red-100">{msg.content.split(' | ').find(p => p.startsWith('Reason: '))?.replace('Reason: ', '') || 'N/A'}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  <span className="font-bold text-gray-500 block mb-1 uppercase text-[10px]">Description</span>
                  {msg.content.split(' | ').find(p => p.startsWith('Description: '))?.replace('Description: ', '') || msg.content}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm mb-3 bg-white p-3 rounded-xl border border-gray-100">{msg.content}</p>
            )}

            {msg.sender_id !== userId && msg.sender?.role !== 'admin' && (
              <div className="mt-2">
                {replyOpen !== msg.id ? (
                  <button onClick={() => setReplyOpen(msg.id)} className="flex items-center gap-1 text-xs font-bold text-maroon hover:text-maroon-dark transition-colors">
                    <Reply className="w-4 h-4" /> {t('admin.replyTo', { role: msg.sender?.role })}
                  </button>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    <textarea 
                      className="w-full p-2 text-sm border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                      rows={2}
                      placeholder={t('admin.draftReplyTo', { name: msg.sender?.full_name })}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 text-xs">
                      <button onClick={() => setReplyOpen(null)} className="px-3 py-1 font-medium text-gray-500 hover:text-gray-700">{t('admin.cancel')}</button>
                      <button onClick={() => handleReply(msg.sender_id)} disabled={submitting} className="flex items-center gap-1.5 px-3 py-1.5 bg-maroon text-white font-bold rounded hover:bg-maroon-dark shadow-sm">
                        {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />} {t('admin.sendReply')}
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
            {t('admin.noMessages')}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;
