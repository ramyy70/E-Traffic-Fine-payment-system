import { AlertTriangle, MapPin, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface Fine {
  id: string;
  driver_name: string;
  vehicle_number: string;
  date_of_offence: string;
  nature_of_offence: string;
  fine_amount: number;
  police_station: string;
  issuing_officer: string;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  qr_code_url: string | null;
  time_of_offence?: string;
  place_of_offence?: string;
}

interface FineCardProps {
  fine: Fine;
  onViewQR: (qrUrl: string | null, fineId: string) => void;
}

const FineCard = ({ fine, onViewQR }: FineCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Format date
  const dateObj = new Date(fine.date_of_offence);
  const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : fine.date_of_offence;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      {/* Status accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${
        fine.status === 'unpaid' ? 'bg-orange-500' : 
        fine.status === 'paid' ? 'bg-green-500' : 'bg-red-600'
      }`}></div>

      <div className="flex flex-col md:flex-row justify-between pl-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-gray-500">{t('dashboard.fineId')}: {fine.id ? (String(fine.id).split('-')[0]?.toUpperCase() || 'N/A') : 'N/A'}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
              fine.status === 'unpaid' ? 'bg-orange-100 text-orange-700' : 
              fine.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {t(`dashboard.${fine.status || 'unpaid'}`)}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${fine.status === 'paid' ? 'text-green-500' : 'text-maroon'}`} />
            {fine.nature_of_offence || 'Traffic Violation'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{fine.place_of_offence || fine.police_station}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>{t('dashboard.vehicle')}: {fine.vehicle_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">O</span>
              <span>{t('dashboard.officer')}: {fine.issuing_officer || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between border-l border-gray-100 pl-6">
          <div className="text-right mb-4">
            <p className="text-sm text-gray-500 font-medium">{t('dashboard.fineAmount')}</p>
            <p className="text-3xl font-bold text-maroon">{t('common.currency')} {fine.fine_amount ? fine.fine_amount.toFixed(2) : '0.00'}</p>
          </div>
          
          {fine.status === 'unpaid' ? (
            <div className="flex flex-col gap-2 w-full">
              <button 
                onClick={() => navigate(`/pay/${fine.id}`)}
                className="w-full px-6 py-2 bg-maroon text-white font-bold rounded-xl hover:bg-maroon-dark transition-colors shadow-md text-center"
              >
                {t('dashboard.payNow')}
              </button>
              <button 
                onClick={() => onViewQR(fine.qr_code_url, fine.id)}
                className="w-full px-6 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('dashboard.viewQr')}
              </button>
            </div>
          ) : (
            <div className="mt-auto items-center text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl">
              ✓ {t('dashboard.paymentCleared')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FineCard;
