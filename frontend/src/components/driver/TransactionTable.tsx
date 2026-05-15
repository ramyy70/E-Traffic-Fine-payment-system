import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface PaymentTransaction {
  id: string;
  fine_id: string;
  amount: number;
  payment_method: string;
  transaction_reference: string;
  paid_at: string;
  fines?: {
    id: string;
    nature_of_offence: string;
  };
}

const TransactionTable = ({ driverId }: { driverId?: string }) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) return;
    const fetchPayments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/fines/payments/${driverId}`);
        const data = await res.json();
        if (data.payments) {
          setTransactions(data.payments);
        }
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [driverId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">{t('dashboard.loadingHistory')}</div>;
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="px-6 py-4 font-bold">{t('dashboard.transactionRef')}</th>
              <th className="px-6 py-4 font-bold">{t('dashboard.fineId')}</th>
              <th className="px-6 py-4 font-bold">{t('dashboard.offence')}</th>
              <th className="px-6 py-4 font-bold">{t('dashboard.date')}</th>
              <th className="px-6 py-4 font-bold">{t('dashboard.fineAmount')}</th>
              <th className="px-6 py-4 font-bold">{t('dashboard.status')}</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {transactions.map((tx, idx) => {
              const fineCode = tx.fines?.id ? tx.fines.id.split('-')[0].toUpperCase() : tx.fine_id.substring(0, 8).toUpperCase();
              return (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-xs font-mono">{tx.transaction_reference}</td>
                  <td className="px-6 py-4 text-maroon font-bold font-mono">{fineCode}</td>
                  <td className="px-6 py-4 text-sm">{tx.fines?.nature_of_offence || t('dashboard.generalOffence')}</td>
                  <td className="px-6 py-4 text-sm">{new Date(tx.paid_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">{t('common.currency')} {Number(tx.amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                      {t('dashboard.paid')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {t('dashboard.noTransactions')}
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
