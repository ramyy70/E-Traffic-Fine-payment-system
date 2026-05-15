import { useState, useEffect } from 'react';
import { Activity, Users, AlertCircle, DollarSign, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminStats = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-maroon" /></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('admin.systemOverview')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: t('admin.totalFines'), value: stats?.totalFines || 0, icon: <AlertCircle className="w-8 h-8 text-orange-500" />, trend: t('admin.liveDbCount') },
          { title: t('admin.totalRevenue'), value: `${t('common.currency')} ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign className="w-8 h-8 text-green-500" />, trend: t('admin.liveSum') },
          { title: t('admin.registeredDrivers'), value: stats?.registeredDrivers || 0, icon: <Users className="w-8 h-8 text-blue-500" />, trend: t('admin.liveDbCount') },
          { title: t('admin.activePolicemen'), value: stats?.activePolicemen || 0, icon: <Activity className="w-8 h-8 text-maroon" />, trend: t('admin.liveDbCount') },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col justify-between hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">{stat.icon}</div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
              <p className="text-xs text-gray-400 mt-2">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t('admin.recentPaymentsSync')}</h3>
          <div className="space-y-4">
            {stats?.recentPayments?.length > 0 ? stats.recentPayments.map((payment: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <p className="font-bold text-sm text-gray-700">{payment.transaction_reference}</p>
                  <p className="text-xs text-gray-500">{new Date(payment.paid_at).toLocaleString()}</p>
                </div>
                <div className="font-bold text-green-600">{t('common.currency')} {payment.amount}</div>
              </div>
            )) : (
               <div className="text-sm text-gray-500 text-center py-4">{t('admin.noRecentPayments')}</div>
            )}
          </div>
        </div>

        <div className="border border-gray-100 rounded-2xl p-6 bg-maroon text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <h3 className="text-lg font-bold mb-4 relative z-10">{t('admin.systemAlerts')}</h3>
          <div className="space-y-3 relative z-10">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <p className="text-sm font-bold text-skyYellow">{t('admin.sysOverviewActive')}</p>
              <p className="text-xs text-white/70">{t('admin.sysOverviewDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
