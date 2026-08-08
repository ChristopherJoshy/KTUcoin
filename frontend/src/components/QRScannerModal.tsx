import React, { useState } from 'react';
import { X, Scan, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { scanQRCode } from '../services/api';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: () => void;
}

// this function is used for organizer live QR scanner and manual token verification modal for more info refer code-wiki.md line 108
export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerifyToken = async (tokenToVerify?: string) => {
    const code = tokenToVerify || tokenInput;
    if (!code) return;

    try {
      setIsScanning(true);
      setErrorMsg(null);
      setScanResult(null);

      const res = await scanQRCode(code);
      if (res.success) {
        setScanResult(res);
        onScanSuccess();
      } else {
        setErrorMsg(res.message || 'Invalid or unrecognized QR Token');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-zen-lg relative border border-slate-200 text-slate-900 bg-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-700 border border-indigo-200">
            <Scan className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900">Scan Student QR Code</h3>
            <p className="text-xs text-slate-500">Verify student attendance at event entrance</p>
          </div>
        </div>

        {/* Camera Scanner Reticle UI */}
        <div className="relative w-full h-48 bg-slate-900 rounded-2xl border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center overflow-hidden mb-4 text-white">
          <div className="absolute inset-0 bg-indigo-500/10 animate-pulse" />
          
          {/* Corner scanner targets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-400" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-indigo-400" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-indigo-400" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-400" />

          <Scan className="w-12 h-12 text-indigo-400 mb-2 opacity-80" />
          <p className="text-xs font-semibold text-slate-200">Scanner Ready</p>
          <p className="text-[10px] text-slate-400">Align QR code within reticle frame</p>
        </div>

        {/* Result Feedback Banner */}
        {scanResult && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-1 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {scanResult.alreadyScanned ? 'Attendance Already Verified!' : 'Attendance Verified!'}
            </div>
            <p className="text-slate-700">
              Student: <span className="font-semibold text-slate-900">{scanResult.registration?.studentId?.name}</span>
            </p>
            <p className="text-slate-700">
              Event: <span className="font-semibold text-slate-900">{scanResult.registration?.eventId?.title}</span>
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Token Paste Form */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600">
            Manual Token Verification (Fast Hackathon Testing)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="e.g. KTU-123456-7890AB-XYZ"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-xs text-slate-900 placeholder-slate-400 font-mono"
            />
            <button
              onClick={() => handleVerifyToken()}
              disabled={isScanning || !tokenInput}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isScanning ? 'Verifying...' : (
                <>
                  <span>Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Auto-forwards to Advisor Queue
          </span>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 underline">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
