import React from 'react';
import { 
  Wrench, 
  Plus, 
  RotateCcw, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  onNewAppointment: () => void;
  onResetDemo: () => void;
  onOpenDemoGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewAppointment,
  onResetDemo,
  onOpenDemoGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Top micro-bar for Bucharest demo info */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Demonstrație interactivă
          </span>
          <span className="hidden sm:inline text-slate-400">
            București & Ilfov • 2 Echipe teren
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors cursor-pointer"
            title="Ghid de demonstrație în 7 pași pentru client"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Ghid Prezentare (3 min)</span>
            <span className="xs:hidden">Ghid</span>
          </button>
          
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Resetează la datele inițiale de test"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Resetează demo</span>
          </button>
        </div>
      </div>

      {/* Main navigation header bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-inner shadow-blue-400/30 shrink-0">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white leading-tight">
                ServiceFlow <span className="text-blue-400 font-extrabold">HVAC</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Programări și intervenții într-un singur loc
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onNewAppointment}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Adaugă o programare nouă în sistem"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="font-medium">+ Programare nouă</span>
          </button>
        </div>
      </div>
    </header>
  );
};
