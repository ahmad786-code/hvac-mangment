import React from 'react';
import { 
  CalendarDays, 
  Wrench, 
  Users, 
  MoreHorizontal, 
  Plus
} from 'lucide-react';

export type NavTab = 'azi' | 'interventii' | 'echipe' | 'mai_multe';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onNewAppointment: () => void;
  todayCount: number;
  inProgressCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  onNewAppointment,
  todayCount,
  inProgressCount,
}) => {
  return (
    <>
      {/* Desktop & Tablet Top Navigation Tabs */}
      <div className="hidden md:block bg-white border-b border-slate-200 sticky top-[73px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex space-x-1 py-1.5" aria-label="Navigare principală">
            <button
              onClick={() => onChangeTab('azi')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'azi'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>Azi</span>
              {todayCount > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                  inProgressCount > 0 
                    ? 'bg-blue-600 text-white animate-pulse' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {todayCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onChangeTab('interventii')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'interventii'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Intervenții</span>
            </button>

            <button
              onClick={() => onChangeTab('echipe')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'echipe'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Echipe (2)</span>
            </button>

            <button
              onClick={() => onChangeTab('mai_multe')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'mai_multe'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>Mai multe</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Floating + Programare Nouă Button (if on mobile, convenient bottom right above nav) */}
      <div className="md:hidden fixed bottom-20 right-4 z-20">
        <button
          onClick={onNewAppointment}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-lg shadow-blue-600/30 font-semibold text-sm transition-transform active:scale-95 cursor-pointer"
          aria-label="Adaugă o programare nouă"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>+ Programare</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.06)] bottom-nav">
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
          <button
            onClick={() => onChangeTab('azi')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative cursor-pointer ${
              activeTab === 'azi'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative">
              <CalendarDays className="w-5 h-5" />
              {todayCount > 0 && (
                <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {todayCount}
                </span>
              )}
            </div>
            <span className="text-xs">Azi</span>
            {activeTab === 'azi' && (
              <span className="absolute bottom-1 w-6 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onChangeTab('interventii')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative cursor-pointer ${
              activeTab === 'interventii'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-xs">Intervenții</span>
            {activeTab === 'interventii' && (
              <span className="absolute bottom-1 w-6 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onChangeTab('echipe')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative cursor-pointer ${
              activeTab === 'echipe'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Echipe</span>
            {activeTab === 'echipe' && (
              <span className="absolute bottom-1 w-6 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onChangeTab('mai_multe')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative cursor-pointer ${
              activeTab === 'mai_multe'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs">Mai multe</span>
            {activeTab === 'mai_multe' && (
              <span className="absolute bottom-1 w-6 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
