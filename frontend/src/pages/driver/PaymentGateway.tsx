import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { Loader2, CreditCard, FileDown, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaymentGateway = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fine, setFine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form mock data
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const fetchFine = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/fines/${id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to load fine details');
        
        if (data.fine.status === 'paid') {
          setError(t('payment.alreadyPaid'));
        } else {
          setFine(data.fine);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFine();
  }, [id]);

  const generatePDF = () => {
    if (!fine) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(139, 26, 47); // Maroon
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(t('nav.brandName'), 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(t('payment.successTitle'), 105, 30, { align: 'center' });
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`${t('dashboard.date')}: ${new Date().toLocaleString()}`, 20, 60);
    doc.text(`${t('dashboard.fineId')}: ${fine.id.toUpperCase()}`, 20, 70);
    doc.text(`${t('payment.transactionRef')}: TXN-${Math.floor(Math.random() * 1000000)}`, 20, 80);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 90, 190, 90);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('fineIssue.driverDetails'), 20, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`${t('auth.fullName')}: ${fine.driver_name}`, 20, 115);
    doc.text(`${t('auth.nic')}: ${fine.driver_nic || 'N/A'}`, 20, 125);
    doc.text(`${t('dashboard.vehicle')}: ${fine.vehicle_number}`, 20, 135);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('fineIssue.offenceInfo'), 20, 155);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`${t('dashboard.offence')}: ${fine.nature_of_offence}`, 20, 165);
    doc.text(`${t('fineIssue.placeOfOffence')}: ${fine.place_of_offence || fine.police_station}`, 20, 175);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 190, 170, 30, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('payment.totalDue')}: ${t('common.currency')} ${fine.fine_amount.toFixed(2)}`, 105, 210, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated receipt and does not require a physical signature.', 105, 280, { align: 'center' });
    
    doc.save(`Receipt_${fine.id.split('-')[0]}.pdf`);
  };

  const createOrder = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/fines/${id}/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');
      return data.id; // Returns the PayPal order ID
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const onApprove = async (data: any) => {
    setProcessing(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/fines/${id}/paypal/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to capture order');
      
      setSuccess(true);
      localStorage.setItem('payment_success_notif', JSON.stringify({
        id: id,
        amount: fine.fine_amount,
        time: new Date().toISOString()
      }));
      
      setTimeout(() => {
        navigate('/driver');
      }, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <PayPalScriptProvider options={{ "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID || "", currency: "USD", intent: "capture" }}>
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 mt-24 px-4 w-full max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('payment.title')}</h1>
        
        {loading ? (
          <div className="flex justify-center flex-col items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-maroon mb-4" />
            <p className="text-gray-500">{t('payment.loadingFine')}</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
            <h3 className="text-red-700 font-bold mb-2">{t('payment.errorTitle')}</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => navigate('/driver')}
              className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
            >
              {t('payment.backToDashboard')}
            </button>
          </div>
        ) : success ? (
          <div className="bg-white p-10 rounded-3xl border border-green-100 text-center shadow-xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('payment.successTitle')}</h2>
            <p className="text-gray-500 font-medium mb-8">{t('payment.successSubtitle')}</p>
            
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button 
                onClick={generatePDF}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-maroon text-white font-bold rounded-2xl hover:bg-maroon-dark transition-all shadow-lg shadow-maroon/20"
              >
                <FileDown className="w-5 h-5" />
                {t('payment.downloadReceipt')}
              </button>
              <button 
                onClick={() => navigate('/driver')}
                className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                {t('payment.backToDashboard')}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-8">{t('payment.redirecting')}</p>
          </div>
        ) : fine ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-maroon"></div>
            
            <div className="mb-8 text-center">
              <p className="text-gray-500 font-medium mb-1">{t('payment.totalDue')}</p>
              <h2 className="text-5xl font-extrabold text-gray-800">{t('common.currency')} {fine.fine_amount.toFixed(2)}</h2>
              <p className="text-sm text-gray-400 mt-2">{t('dashboard.fineId')}: {fine.id.split('-')[0].toUpperCase()}</p>
            </div>

            <div className="mt-6">
              {processing && (
                <div className="flex justify-center items-center py-4 text-maroon mb-4">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>{t('payment.processing')}</span>
                </div>
              )}
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", color: "blue" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  setError("PayPal checkout failed. Please try again.");
                  console.error("PayPal Checkout onError", err);
                }}
                disabled={processing}
              />
              <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-center">
                 <button 
                  type="button"
                  onClick={() => navigate('/driver')}
                  className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                  disabled={processing}
                >
                  {t('payment.cancel')}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
    </PayPalScriptProvider>
  );
};

export default PaymentGateway;
