import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, ShieldCheck, Copy, Check } from 'lucide-react';
import { Registration } from '../types';

interface QRModalProps {
  registration: Registration | null;
  onClose: () => void;
}

// this function is used for displaying student verified attendance QR code pass for organizer scan for more info refer code-wiki.md line 106
export const QRModal: React.FC<QRModalProps> = ({ registration, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!registration) return null;

  const event = registration.eventId as any;
  const student = registration.studentId as any;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(registration.qrCodeToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal w-full max-w-sm rounded-3xl p-6 shadow-zen-lg relative border border-slate-200 text-slate-900 text-center flex flex-col items-center bg-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-3 bg-teal-50 rounded-2xl text-teal-700 border border-teal-200 mb-3">
          <QrCode className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold font-display text-slate-900">Event Entry QR Pass</h3>
        <p className="text-xs text-slate-500 mt-0.5 mb-4">Show this QR code at the venue door for organizer scanning</p>

        {/* QR Box Container */}
        <div className="p-4 bg-white rounded-2xl shadow-md mb-4 border border-slate-200 flex flex-col items-center">
          <QRCodeSVG
            value={registration.qrCodeToken}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-left mb-4 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Event:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[180px]">{event?.title || 'Campus Event'}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Student:</span>
            <span className="font-semibold text-teal-700">{student?.name || 'Student'}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Points Value:</span>
            <span className="font-bold text-amber-700">{event?.points} Points ({event?.activityGroup})</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Scan Status:</span>
            <span className={`font-semibold ${registration.attended ? 'text-emerald-700' : 'text-slate-600'}`}>
              {registration.attended ? '✓ Verified Attended' : 'Pending Gate Scan'}
            </span>
          </div>
        </div>

        {/* Token code box */}
        <div className="w-full flex items-center justify-between bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 text-[11px] text-slate-600">
          <span className="font-mono truncate">{registration.qrCodeToken}</span>
          <button
            onClick={handleCopyToken}
            className="p-1 hover:text-teal-700 transition-colors ml-2 shrink-0"
            title="Copy QR Token"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verifiable unique registration token</span>
        </div>
      </div>
    </div>
  );
};
