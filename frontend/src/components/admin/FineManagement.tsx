import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AdminFine {
  id: string;
  driver?: { nic: string };
  driver_name: string;
  nature_of_offence: string;
  issuing_officer: string;
  fine_amount: number;
  status: string;
}

const FineManagement = () => {
  const { t } = useTranslation();
  const [fines, setFines] = useState<AdminFine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredFines = fines.filter(fine => {
    const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
    const matchesSearch = !searchQuery || fine.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    const fetchAllFines = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/fines/all');
        const data = await res.json();
        if (data.fines) {
          setFines(data.fines);
        }
      } catch (err) {
        console.error("Failed to load fines", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllFines();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t('admin.fineRecordsOverview')}</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.searchFineId')} 
            className="px-4 py-2 border border-gray-300 rounded-xl w-64 focus:border-maroon focus:ring-maroon"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white"
          >
            <option value="all">{t('admin.allStatuses')}</option>
            <option value="paid">{t('admin.paid')}</option>
            <option value="unpaid">{t('admin.unpaid')}</option>
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
                <th className="p-4">{t('admin.fineId')}</th>
                <th className="p-4">{t('admin.offence')}</th>
                <th className="p-4">{t('admin.driverNic')}</th>
                <th className="p-4">{t('admin.issuedBy')}</th>
                <th className="p-4">{t('admin.amount')}</th>
                <th className="p-4">{t('admin.status')}</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredFines.map((fine, idx) => {
                const fineCode = fine.id.split('-')[0].toUpperCase();
                return (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-mono font-bold text-maroon">{fineCode}</td>
                    <td className="p-4">{fine.nature_of_offence || t('admin.general')}</td>
                    <td className="p-4 text-sm font-mono">{fine.driver?.nic || 'N/A'}</td>
                    <td className="p-4 text-sm">{fine.issuing_officer}</td>
                    <td className="p-4 font-bold">{t('common.currency')} {Number(fine.fine_amount).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${fine.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {fine.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredFines.length === 0 && (
            <div className="p-8 text-center text-gray-500 w-full col-span-full">
              {t('admin.noFines')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FineManagement;
