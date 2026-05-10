import { X } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string | null;
  fineId: string;
}

const QRModal = ({ isOpen, onClose, qrCodeUrl, fineId }: QRModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl scale-100 transition-transform relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Fine QR Code</h3>
          <p className="text-sm text-gray-500 mt-1">ID: {fineId.split('-')[0].toUpperCase()}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-center border border-gray-100 min-h-[250px]">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="Fine QR Code" className="w-full max-w-[200px] h-auto object-contain rounded-xl" />
          ) : (
            <p className="text-gray-500 font-medium text-sm">QR Code not available</p>
          )}
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QRModal;
