import { useState } from 'react';
import { HelpCircle, FileText, Phone, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const SupportSection = () => {
  const { t } = useTranslation();
  const [msgOpen, setMsgOpen] = useState(false);
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
        body: JSON.stringify({ sender_id, receiver_id: null, content, sender_role: 'driver' })
      });
      setSuccess(true);
      setTimeout(() => { setMsgOpen(false); setSuccess(false); setContent(''); }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-maroon p-6 rounded-3xl shadow-lg relative overflow-hidden text-white">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" /> {t('support.title')}
        </h2>
        
        <div className="space-y-4">
          <div className="w-full flex items-start gap-3 p-3 bg-white/10 rounded-xl border border-white/10 text-left">
            <FileText className="w-5 h-5 text-skyYellow shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm mb-1">{t('support.faq.title')}</div>
              <ul className="text-xs text-white/80 list-disc list-inside space-y-1">
                <li><Trans i18nKey="support.faq.item1">Click <b>Pay Now</b> securely via your card portal.</Trans></li>
                <li><Trans i18nKey="support.faq.item2">Fines over 14 days old mark as <b>Overdue</b> natively.</Trans></li>
                <li><Trans i18nKey="support.faq.item3">Show the Police the green <b>Paid</b> badge directly on scene.</Trans></li>
                <li>{t('support.faq.item4')}</li>
              </ul>
            </div>
          </div>
          
          {!msgOpen ? (
            <button onClick={() => setMsgOpen(true)} className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/10 text-left">
              <MessageSquare className="w-5 h-5 text-skyYellow" />
              <div>
                <div className="font-bold text-sm">{t('support.contact.title')}</div>
                <div className="text-xs text-white/70">{t('support.contact.subtitle')}</div>
              </div>
            </button>
          ) : (
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex flex-col gap-2">
              <div className="font-bold text-sm">{t('support.contact.formTitle')}</div>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={t('support.contact.placeholder')}
                className="w-full p-2 bg-white/5 border border-white/20 rounded text-sm text-white placeholder-white/40 focus:outline-none focus:border-skyYellow"
                rows={3}
              />
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={() => setMsgOpen(false)} className="px-3 py-1 text-xs text-white/70 hover:text-white">{t('support.contact.cancel')}</button>
                <button onClick={sendMessage} disabled={loading || success} className="flex justify-center items-center px-4 py-1.5 text-xs bg-skyYellow text-maroon-dark font-bold rounded hover:bg-white transition-colors">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle className="w-4 h-4" /> : t('support.contact.send')}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/20 flex flex-col items-center">
            <p className="text-sm text-white/80 mb-2">{t('support.emergency')}</p>
            <div className="flex items-center gap-2 font-bold text-xl text-skyYellow">
              <Phone className="w-5 h-5" /> 119
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
