import { useState } from 'react';
import { X, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScanQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScanQRModal = ({ isOpen, onClose }: ScanQRModalProps) => {
  const [fineId, setFineId] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleScanSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (fineId.trim()) {
      onClose();
      navigate(`/pay/${fineId.trim()}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6 mt-2">
          <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-maroon" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Scan QR Code</h3>
          <p className="text-sm text-gray-500 mt-2">Point your camera at the fine ticket QR code to proceed to payment.</p>
        </div>

        <div className="bg-gray-100 rounded-2xl h-48 mb-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-maroon/5 group-hover:bg-maroon/10 transition-colors pointer-events-none"></div>
          <p className="text-gray-400 font-medium text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Camera Active (Simulated)
          </p>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or enter ID manually</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleScanSimulation} className="mt-4 flex gap-2">
          <input 
            type="text" 
            value={fineId}
            onChange={(e) => setFineId(e.target.value)}
            placeholder="e.g. 1a2b3c4d-..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-maroon focus:border-maroon transition-colors"
            required
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-maroon text-white font-bold rounded-xl hover:bg-maroon-dark transition-colors shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScanQRModal;
