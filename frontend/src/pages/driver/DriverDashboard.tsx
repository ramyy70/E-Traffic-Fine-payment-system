import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import FineCard, { type Fine } from '../../components/driver/FineCard';
import TransactionTable from '../../components/driver/TransactionTable';
import DashboardChart, { type FineDataPoint } from '../../components/driver/DashboardChart';
import SupportSection from '../../components/driver/SupportSection';
import QRModal from '../../components/driver/QRModal';
import ScanQRModal from '../../components/driver/ScanQRModal';
import { QrCode, Loader2 } from 'lucide-react';

const DriverDashboard = () => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [driverId, setDriverId] = useState<string>('');
  
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<{ url: string | null, id: string }>({ url: null, id: '' });
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const navigate = useNavigate();

  const [successNotif, setSuccessNotif] = useState<any>(null);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          navigate('/login');
          return;
        }
        
        let user;
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        if (!user || !user.id) {
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        
        setDriverId(user.id);

        const res = await fetch(`http://localhost:5000/api/fines/driver/${user.id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to load fines');
        
        setFines(data.fines || []);
        
        // Check for success notification
        const notifStr = localStorage.getItem('payment_success_notif');
        if (notifStr) {
          setSuccessNotif(JSON.parse(notifStr));
          localStorage.removeItem('payment_success_notif');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFines();
  }, [navigate]);

  const handleViewQR = (qrUrl: string | null, fineId: string) => {
    setQrModalData({ url: qrUrl, id: fineId });
    setIsQRModalOpen(true);
  };

  const activeFines = fines.filter(f => f.status === 'unpaid' || f.status === 'overdue');

  const chartData: FineDataPoint[] = React.useMemo(() => {
    const grouped = fines.reduce((acc, fine) => {
      const dateStr = fine.date_of_offence ? new Date(fine.date_of_offence).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown';
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).map(k => ({ date: k, count: grouped[k], totalAmount: 0 }));
  }, [fines]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 mt-24 px-4 w-full max-w-7xl mx-auto mb-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, check your traffic fine status and history.</p>
          </div>
          <button 
            onClick={() => setIsScanModalOpen(true)}
            className="px-6 py-2 bg-white border border-gray-200 shadow-sm rounded-xl font-medium text-maroon hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Scan QR Code to Pay
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium">
            Error: {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Active Fines & History */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Active Fines</h2>
                <span className={`${activeFines.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} font-bold px-3 py-1 rounded-full text-xs`}>
                  {activeFines.length} Pending
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                  <div className="flex items-center justify-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-maroon" />
                  </div>
                ) : activeFines.length > 0 ? (
                  activeFines.map(fine => (
                    <FineCard key={fine.id} fine={fine} onViewQR={handleViewQR} />
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-500">You have no active fines. Drive safely!</p>
                  </div>
                )}
              </div>
            </section>

            <DashboardChart data={chartData} />

            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h2>
              <TransactionTable driverId={driverId} />
            </section>
          </div>

          {/* Right Column - Messages & Support */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">System Messages</h2>
              <div className="space-y-4">
                {successNotif && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-in slide-in-from-top-2 duration-500 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                      <p className="text-xs font-bold text-green-700 uppercase tracking-wider">SMS Confirmation</p>
                    </div>
                    <p className="text-sm text-green-800 font-medium leading-relaxed">
                      E-TRAFFIC: Payment for Fine ID {successNotif.id.split('-')[0].toUpperCase()} of Rs. {successNotif.amount} was successful. Thank you.
                    </p>
                    <p className="text-[10px] text-green-600 mt-2 font-bold">{new Date(successNotif.time).toLocaleTimeString()}</p>
                  </div>
                )}
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="text-sm text-yellow-800 font-medium">Your license is nearing expiry. Please renew it before next month.</p>
                  <p className="text-xs text-yellow-600 mt-2">2 days ago</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-sm text-green-800 font-medium">Drive safe! Make sure to follow traffic rules to avoid penalties.</p>
                  <p className="text-xs text-green-600 mt-2">1 week ago</p>
                </div>
              </div>
            </section>

            <section>
              <SupportSection />
            </section>
          </div>
        </div>
      </div>

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        qrCodeUrl={qrModalData.url} 
        fineId={qrModalData.id} 
      />

      <ScanQRModal 
        isOpen={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)} 
      />
    </div>
  );
};

export default DriverDashboard;
