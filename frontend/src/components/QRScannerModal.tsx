import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Camera } from 'lucide-react';
import { scanQRCode } from '../services/api';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: () => void;
}

// this function is used for organizer live webcam QR camera scanner and token verification modal for more info refer code-wiki.md line 114
export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const { toast } = useToast();
  const [tokenInput, setTokenInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      setErrorMsg(null);
      setScanResult(null);

      const scannerId = 'html5-qr-reader-elem';
      const html5QrCode = new Html5Qrcode(scannerId);
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 }
          },
          decodedText => {
            if (isMounted) {
              handleVerifyToken(decodedText);
            }
          },
          () => {
            // Ignore scan errors (frames without QR codes)
          }
        )
        .then(() => {
          if (isMounted) setCameraActive(true);
        })
        .catch(() => {
          if (isMounted) setCameraActive(false);
        });
    }

    return () => {
      isMounted = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(e => console.error(e));
      }
    };
  }, [isOpen]);

  const handleVerifyToken = async (codeToVerify?: string) => {
    const code = codeToVerify || tokenInput;
    if (!code) return;

    try {
      setIsVerifying(true);
      setErrorMsg(null);
      setScanResult(null);

      const res = await scanQRCode(code);
      if (res.success) {
        setScanResult(res);
        toast(res.alreadyScanned ? 'Already verified' : 'Attendance verified', {
          description: res.registration?.studentId?.name || 'Student',
          variant: 'success'
        });
        onScanSuccess();
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
      } else {
        setErrorMsg(res.message || 'Invalid or unrecognized QR Token');
        toast(res.message || 'Verification failed', { variant: 'error' });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        stopScanner();
        onClose();
      }}
      title="Scan Student QR Pass"
      subtitle="Live camera scanner & door verification"
      icon={<Scan className="w-5 h-5" />}
      size="md"
    >
      {/* Camera viewport */}
      <div className="relative w-full h-52 sm:h-56 bg-slate-950 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden mb-4 flex flex-col items-center justify-center">
        <div id="html5-qr-reader-elem" className="w-full h-full object-cover" />

        {!cameraActive && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-slate-300 p-4 text-center">
            <Camera className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-semibold text-white">Webcam Scanner Initializing</p>
            <p className="text-[10px] text-slate-400 mt-1">Or use manual token verification below</p>
          </div>
        )}
      </div>

      {/* Success banner */}
      {scanResult && (
        <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs space-y-1 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            {scanResult.alreadyScanned ? 'Attendance Already Verified!' : 'Attendance Verified!'}
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Student:{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {scanResult.registration?.studentId?.name || 'Verified Student'}
            </span>
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            Event:{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {scanResult.registration?.eventId?.title || 'Campus Event'}
            </span>
          </p>
        </div>
      )}

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-800 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Manual token entry */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
          Manual token entry
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerifyToken()}
            placeholder="e.g. KTU-123456-7890AB-XYZ"
            className="form-input flex-1 font-mono"
          />
          <button
            onClick={() => handleVerifyToken()}
            disabled={isVerifying || !tokenInput}
            className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : (
              <>
                <span>Verify</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
          Auto-forwards to advisor queue
        </span>
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 underline"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};
