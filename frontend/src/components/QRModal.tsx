import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, ShieldCheck, Copy, Check, Download } from 'lucide-react';
import { Registration } from '../types';
import { Modal } from './ui/Modal';
import { useToast } from './ui/Toast';

interface QRModalProps {
  registration: Registration | null;
  onClose: () => void;
}

// this function is used for displaying student verified attendance QR code pass for organizer scan for more info refer code-wiki.md line 112
export const QRModal: React.FC<QRModalProps> = ({ registration, onClose }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!registration) return null;

  const event = registration.eventId as any;
  const student = registration.studentId as any;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(registration.qrCodeToken);
    setCopied(true);
    toast('Token copied', { variant: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    try {
      const svgElement = document.getElementById('student-qr-svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width + 40;
        canvas.height = img.height + 40;
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 20, 20);
        }
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `KTU_Pass_${registration.qrCodeToken.slice(-6)}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (e) {
      console.error('Failed to download QR image', e);
    }
  };

  return (
    <Modal
      isOpen={Boolean(registration)}
      onClose={onClose}
      title="Event Entry QR Pass"
      subtitle="Show this at the venue door for scanning"
      icon={<QrCode className="w-5 h-5" />}
      size="sm"
      className="items-center"
    >
      <div className="flex flex-col items-center">
        {/* QR box */}
        <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center">
          <QRCodeSVG
            id="student-qr-svg"
            value={registration.qrCodeToken}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        <button
          onClick={handleDownloadQR}
          className="my-4 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1.5 underline transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Save Pass Image to Phone
        </button>

        <div className="w-full bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-left mb-4 text-xs">
          <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400">
            <span>Event:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
              {event?.title || 'Campus Event'}
            </span>
          </div>
          <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400">
            <span>Student:</span>
            <span className="font-semibold text-teal-700 dark:text-teal-400">
              {student?.name || 'Student'}
            </span>
          </div>
          <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400">
            <span>Points Value:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {event?.points} Points ({event?.activityGroup})
            </span>
          </div>
          <div className="flex justify-between gap-3 text-slate-500 dark:text-slate-400">
            <span>Scan Status:</span>
            <span className={`font-semibold ${registration.attended ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
              {registration.attended ? 'Verified Attended' : 'Pending Gate Scan'}
            </span>
          </div>
        </div>

        {/* Token box */}
        <div className="w-full flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="font-mono truncate">{registration.qrCodeToken}</span>
          <button
            onClick={handleCopyToken}
            className="p-1 hover:text-teal-700 dark:hover:text-teal-400 transition-colors ml-2 shrink-0"
            title="Copy QR Token"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Verifiable unique registration token
        </div>
      </div>
    </Modal>
  );
};
