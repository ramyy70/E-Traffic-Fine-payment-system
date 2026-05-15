import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Complaint {
  id: string;
  fine_id: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
}

const ComplaintSystem = () => {
  const { t } = useTranslation();
  const [fineId, setFineId] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  const fetchComplaints = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${userId}`);
      const data = await res.json();
      if (data.messages) {
        // Filter messages that are complaints
        const filtered = data.messages
          .filter((msg: any) => msg.content.startsWith('[COMPLAINT]'))
          .map((msg: any) => {
            const parts = msg.content.split(' | ');
            const finePart = parts.find((p: string) => p.startsWith('Fine ID: '))?.replace('Fine ID: ', '');
            const reasonPart = parts.find((p: string) => p.startsWith('Reason: '))?.replace('Reason: ', '');
            const descPart = parts.find((p: string) => p.startsWith('Description: '))?.replace('Description: ', '');
            
            return {
              id: msg.id,
              fine_id: finePart || 'N/A',
              reason: reasonPart || 'General',
              description: descPart || msg.content,
              status: msg.status || 'Pending',
              created_at: msg.created_at
            };
          });
        setComplaints(filtered);
      }
    } catch (err) {
      console.error('Error fetching complaints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !fineId || !reason || !description) return;

    setSubmitting(true);
    const structuredContent = `[COMPLAINT] Fine ID: ${fineId} | Reason: ${reason} | Description: ${description}`;

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: null, // Go to admin
          content: structuredContent,
          sender_role: 'driver'
        })
      });

      if (res.ok) {
        setSuccess(true);
        setFineId('');
        setReason('');
        setDescription('');
        fetchComplaints();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error submitting complaint', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
      {/* Submit Complaint */}
      <div className="bg-maroon p-8 rounded-[2rem] shadow-xl relative overflow-hidden text-white border border-white/10">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Notification Overlay */}
          {success && (
            <div className="absolute inset-x-0 -top-4 flex justify-center z-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold text-sm">{t('complaints.complaintSubmitSuccess')}</span>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold mb-2">{t('complaints.submitTitle')}</h2>
          <p className="text-white/70 text-sm mb-8">{t('complaints.submitDesc')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-skyYellow/90">{t('complaints.fineId')}</label>
              <input 
                type="text"
                value={fineId}
                onChange={e => setFineId(e.target.value)}
                placeholder={t('complaints.fineIdPlaceholder')}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-skyYellow transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-skyYellow/90">{t('complaints.reason')}</label>
              <select 
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-skyYellow transition-colors appearance-none"
                required
              >
                <option value="" className="bg-maroon-dark text-white/50">{t('complaints.selectReason')}</option>
                <option value="Unfair Fine" className="bg-maroon-dark">{t('complaints.unfairFine')}</option>
                <option value="System Error" className="bg-maroon-dark">{t('complaints.systemError')}</option>
                <option value="Payment Not Reflected" className="bg-maroon-dark">{t('complaints.paymentNotReflected')}</option>
                <option value="Other" className="bg-maroon-dark">{t('complaints.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-skyYellow/90">{t('complaints.description')}</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t('complaints.descriptionPlaceholder')}
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-skyYellow transition-colors resize-none"
                required
              />
            </div>

            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 rounded-2xl text-sm font-medium text-white/80 hover:bg-white/10 transition-all mb-4"
            >
              <Paperclip className="w-4 h-4" />
              {t('complaints.attachEvidence')}
            </button>

            <button 
              type="submit"
              disabled={submitting || success}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold shadow-lg transform active:scale-95 transition-all ${
                success 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t('complaints.complaintSubmitSuccess')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('complaints.submit')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* My Complaints */}
      <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/5 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-2">{t('complaints.myComplaintsTitle')}</h2>
        <p className="text-gray-400 text-sm mb-8">{t('complaints.myComplaintsDesc')}</p>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : complaints.length > 0 ? (
            complaints.map((complaint) => (
              <div key={complaint.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Fine #{complaint.fine_id}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('complaints.submittedOn')} {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t(`complaints.${complaint.status.toLowerCase()}`, { defaultValue: complaint.status })}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-xs font-bold text-skyYellow mb-1 uppercase tracking-tighter opacity-80">{complaint.reason}</div>
                  <div className="bg-black/20 rounded-xl p-3 border border-white/5 text-sm text-gray-300 leading-relaxed">
                    {complaint.description}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <AlertCircle className="w-12 h-12 text-white/20 mb-4" />
              <p className="text-gray-500 font-medium">{t('complaints.noComplaints')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintSystem;
