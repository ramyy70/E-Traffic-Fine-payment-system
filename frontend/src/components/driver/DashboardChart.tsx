import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

export interface FineDataPoint {
  date: string;
  count: number;
  totalAmount: number;
}

interface DashboardChartProps {
  data: FineDataPoint[];
  title?: string;
  subtitle?: string;
}

const DashboardChart = ({ data, title, subtitle }: DashboardChartProps) => {
  const { t } = useTranslation();
  const displayTitle = title || t('dashboard.fineHistoryTitle');
  const displaySubtitle = subtitle || t('dashboard.fineHistorySubtitle');
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{displayTitle}</h2>
        <p className="text-sm text-gray-500">{displaySubtitle}</p>
      </div>
      <div className="h-64 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#750000" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#750000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#750000', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="count" name={t('dashboard.finesIssued')} stroke="#750000" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="font-medium">{t('dashboard.noChartData')}</p>
            <p className="text-xs">{t('dashboard.noChartDataDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
