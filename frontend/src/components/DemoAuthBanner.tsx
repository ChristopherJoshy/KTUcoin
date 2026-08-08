import React, { useState } from 'react';
import { Info, UserCheck, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DemoAuthBannerProps {
  onOpenCreateProfile: () => void;
}

// this function is used for displaying hackathon demo role switcher banner with intentional architecture explanation for more info refer code-wiki.md line 96
export const DemoAuthBanner: React.FC<DemoAuthBannerProps> = ({ onOpenCreateProfile }) => {
  const { currentUser, profiles, selectProfile, activeRole, switchRole } = useAuth();
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 text-xs text-slate-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left explanation */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 text-teal-800 border border-teal-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="font-semibold text-slate-900">Stack Wars Hackathon Demo Mode:</span>{' '}
            <span className="text-slate-600">
              Zero-friction role switching active. Demo student, creator, and advisor profiles pre-loaded.
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-teal-700 hover:text-teal-900 underline font-medium ml-1 flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            {expanded ? 'Hide Info' : 'Why Fake Auth?'}
          </button>
        </div>

        {/* Right role switcher & quick profile picker */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => switchRole('STUDENT')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeRole === 'STUDENT'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => switchRole('ORGANIZER')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeRole === 'ORGANIZER'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Organizer
            </button>
            <button
              onClick={() => switchRole('TEACHER')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeRole === 'TEACHER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Advisor
            </button>
          </div>

          <button
            onClick={onOpenCreateProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-medium transition-all text-xs shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            New Profile
          </button>
        </div>
      </div>

      {/* Expanded Explanation Modal/Drawer */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 animate-fadeIn">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-teal-800 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" /> 1. Frictionless Judge Review
            </h4>
            <p className="text-slate-600">
              Evaluators can test the complete end-to-end lifecycle (discover event &rarr; register &rarr; scan QR &rarr; approve points) without creating temporary email accounts.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-indigo-800 flex items-center gap-1.5 mb-1">
              <UserCheck className="w-4 h-4" /> 2. Multi-Role Testing
            </h4>
            <p className="text-slate-600">
              Switch roles in 1 click to test how students, club organizers, and staff advisors experience their respective panels.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-emerald-800 flex items-center gap-1.5 mb-1">
              <Plus className="w-4 h-4" /> 3. Dynamic Profile Generator
            </h4>
            <p className="text-slate-600">
              Create custom student IDs or teacher designations on the fly to test multi-student point aggregations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
