import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { Loader2, CreditCard, FileDown, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const PaymentGateway = () => {
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
          setError('This fine has already been paid.');
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
    doc.text('E-Traffic Fine System', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Official Payment Receipt', 105, 30, { align: 'center' });
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Receipt Date: ${new Date().toLocaleString()}`, 20, 60);
    doc.text(`Fine ID: ${fine.id.toUpperCase()}`, 20, 70);
    doc.text(`Transaction Reference: TXN-${Math.floor(Math.random() * 1000000)}`, 20, 80);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 90, 190, 90);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Driver Details', 20, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${fine.driver_name}`, 20, 115);
    doc.text(`NIC: ${fine.driver_nic || 'N/A'}`, 20, 125);
    doc.text(`Vehicle: ${fine.vehicle_number}`, 20, 135);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Offence Details', 20, 155);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Offence: ${fine.nature_of_offence}`, 20, 165);
    doc.text(`Location: ${fine.place_of_offence || fine.police_station}`, 20, 175);
    
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 190, 170, 30, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Paid: Rs. ${fine.fine_amount.toFixed(2)}`, 105, 210, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated receipt and does not require a physical signature.', 105, 280, { align: 'center' });
    
    doc.save(`Receipt_${fine.id.split('-')[0]}.pdf`);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    // Simulate network delay for mock gateway
    setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/fines/${id}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_method: 'credit_card' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Payment failed');
        
        setSuccess(true);
        // Set notification flag for dashboard
        localStorage.setItem('payment_success_notif', JSON.stringify({
          id: id,
          amount: fine.fine_amount,
          time: new Date().toISOString()
        }));
        
        setTimeout(() => {
          navigate('/driver');
        }, 5000); // Give more time to download receipt
      } catch (err: any) {
        setError(err.message);
        setProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 mt-24 px-4 w-full max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Secure Payment Gateway</h1>
        
        {loading ? (
          <div className="flex justify-center flex-col items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-maroon mb-4" />
            <p className="text-gray-500">Loading fine details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
            <h3 className="text-red-700 font-bold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => navigate('/driver')}
              className="mt-6 px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
            >
              Back to Dashboard
            </button>
          </div>
        ) : success ? (
          <div className="bg-white p-10 rounded-3xl border border-green-100 text-center shadow-xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 font-medium mb-8">Your transaction has been processed securely.</p>
            
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button 
                onClick={generatePDF}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-maroon text-white font-bold rounded-2xl hover:bg-maroon-dark transition-all shadow-lg shadow-maroon/20"
              >
                <FileDown className="w-5 h-5" />
                Download Receipt (PDF)
              </button>
              <button 
                onClick={() => navigate('/driver')}
                className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-8">Auto-redirecting in 5 seconds...</p>
          </div>
        ) : fine ? (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-maroon"></div>
            
            <div className="mb-8 text-center">
              <p className="text-gray-500 font-medium mb-1">Total Due</p>
              <h2 className="text-5xl font-extrabold text-gray-800">Rs. {fine.fine_amount.toFixed(2)}</h2>
              <p className="text-sm text-gray-400 mt-2">Fine ID: {fine.id.split('-')[0].toUpperCase()}</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                <input 
                  type="text" 
                  defaultValue={fine.driver_name || 'John Doe'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon transition-colors bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={16}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                  <input 
                    type="text" 
                    value={cvc}
                    onChange={e => setCvc(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => navigate('/driver')}
                  className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-maroon text-white font-bold rounded-xl hover:bg-maroon-dark transition-all shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    `Pay Rs. ${fine.fine_amount.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentGateway;
