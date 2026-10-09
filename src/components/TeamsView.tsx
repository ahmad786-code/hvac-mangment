import React, { useState } from 'react';
import { 
  Team, 
  Appointment 
} from '../types/hvac';
import { 
  getStatusBadge, 
  getPriorityBadge, 
  getDayLabel,
  formatRomanianDate 
} from '../utils/formatters';
import { 
  Users, 
  Truck, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRightLeft, 
  ChevronRight, 
  MapPin, 
  Calendar,
  Briefcase
} from 'lucide-react';

interface TeamsViewProps {
  teams: Team[];
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onReassignAppointment: (appointmentId: string, targetTeamId: 'echipa-1' | 'echipa-2') => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  appointments,
  onSelectAppointment,
  onReassignAppointment,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<'azi' | 'maine' | 'toate'>('azi');
  const [activeTeamId, setActiveTeamId] = useState<'echipa-1' | 'echipa-2' | 'toate'>('toate');

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const filterByDay = (apt: Appointment) => {
    if (selectedDayTab === 'azi') return apt.date === todayStr;
    if (selectedDayTab === 'maine') return apt.date === tomorrowStr;
    return true;
  };

  const dayLabel = selectedDayTab === 'azi' ? 'Astăzi' : selectedDayTab === 'maine' ? 'Mâine' : 'Toate perioadele';

  return (
    <div className="space-y-5 pb-24 md:pb-12">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gestiune Echipe Tehnice
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitorizare 2 echipe, 4 tehnicieni, sarcini alocate și reasignare rapidă
          </p>
        </div>

        {/* Day Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setSelectedDayTab('azi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDayTab === 'azi'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Azi
          </button>
          <button
            onClick={() => setSelectedDayTab('maine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDayTab === 'maine'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mâine
          </button>
          <button
            onClick={() => setSelectedDayTab('toate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedDayTab === 'toate'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toate zilele
          </button>
        </div>
      </div>

      {/* Teams Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teams.map((team) => {
          const targetTeamId = team.id === 'echipa-1' ? 'echipa-2' : 'echipa-1';
          const targetTeamName = team.id === 'echipa-1' ? 'Echipa 2' : 'Echipa 1';

          // Team appointments filtered by selected day
          const teamAppointments = appointments
            .filter((a) => a.assignedTeamId === team.id && filterByDay(a))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const completedCount = teamAppointments.filter((a) => a.status === 'finalizata').length;
          const remainingCount = teamAppointments.filter((a) => a.status !== 'finalizata').length;
          const inProgress = teamAppointments.find((a) => a.status === 'in_desfasurare');
          const nextScheduled = teamAppointments.find((a) => a.status === 'programata');

          const isTeam1 = team.id === 'echipa-1';
          const accentColor = isTeam1 ? 'border-blue-500' : 'border-emerald-500';
          const badgeBg = isTeam1 ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800';

          return (
            <div 
              key={team.id}
              className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col`}
            >
              {/* Team Header Card */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner ${
                      isTeam1 ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}>
                      {isTeam1 ? 'E1' : 'E2'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-slate-900">{team.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeBg}`}>
                          Activă
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{team.vehicle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Load Badge */}
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-medium block">
                      {dayLabel}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {completedCount}/{teamAppointments.length} Finalizate
                    </span>
                  </div>
                </div>

                {/* Coverage Area */}
                <div className="mt-3 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-semibold text-slate-700">Rază acoperire:</span>
                  <span className="truncate">{team.coverageArea}</span>
                </div>

                {/* Technicians List (2 per team) */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Componență Echipă (2 Tehnicieni)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {team.technicians.map((tech) => (
                      <div
                        key={tech.id}
                        className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-xs text-slate-900 truncate">{tech.name}</p>
                          <p className="text-[11px] text-blue-700 font-medium truncate">{tech.role}</p>
                          <p className="text-[10px] text-slate-500 truncate" title={tech.specialization}>
                            {tech.specialization}
                          </p>
                        </div>
                        <a
                          href={`tel:${tech.phone.replace(/\s+/g, '')}`}
                          className="p-1.5 bg-white hover:bg-blue-50 text-emerald-600 rounded-lg border border-slate-200 shrink-0 transition-colors cursor-pointer"
                          title={`Apelează ${tech.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Status Summary Pills */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[11px] text-slate-500 block">Total alocate</span>
                    <span className="text-base font-bold text-slate-900">{teamAppointments.length}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <span className="text-[11px] text-emerald-700 block">Finalizate</span>
                    <span className="text-base font-bold text-emerald-800">{completedCount}</span>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <span className="text-[11px] text-amber-700 block">Rămase</span>
                    <span className="text-base font-bold text-amber-800">{remainingCount}</span>
                  </div>
                </div>

                {/* Next scheduled job highlight */}
                {nextScheduled && (
                  <div className="mt-3 bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-xs text-amber-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="font-semibold">Următoarea intervenție:</span>
                      <span className="truncate">{nextScheduled.startTime} • {nextScheduled.clientName}</span>
                    </div>
                    <button
                      onClick={() => onSelectAppointment(nextScheduled)}
                      className="text-amber-800 font-bold hover:underline shrink-0 text-[11px] cursor-pointer"
                    >
                      Detalii &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Assigned Jobs List for this team */}
              <div className="p-4 sm:p-5 flex-1 space-y-3 bg-slate-50/40">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Intervenții Alocate ({teamAppointments.length})</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">{dayLabel}</span>
                </div>

                {teamAppointments.length === 0 ? (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                    Nicio lucrare alocată pentru această echipă în perioada selectată.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {teamAppointments.map((apt) => {
                      const statusInfo = getStatusBadge(apt.status);
                      const priorityInfo = getPriorityBadge(apt.priority);

                      return (
                        <div
                          key={apt.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                                {apt.startTime}
                              </span>
                              <span className="text-xs text-slate-500">
                                {getDayLabel(apt.date)}
                              </span>
                              {apt.priority === 'urgent' && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                                  Urgentă
                                </span>
                              )}
                            </div>

                            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${statusInfo.bg}`}>
                              {statusInfo.label}
                            </span>
                          </div>

                          <div>
                            <p className="font-bold text-sm text-slate-900">{apt.clientName}</p>
                            <p className="text-xs text-slate-600 truncate">{apt.address} ({apt.sector})</p>
                            <p className="text-xs text-slate-500 italic mt-0.5 truncate">{apt.problemDescription}</p>
                          </div>

                          {/* Quick Action buttons: Reassign to other team or view */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => onReassignAppointment(apt.id, targetTeamId)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title={`Mutați această intervenție la ${targetTeamName}`}
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Mutați la {targetTeamName}</span>
                            </button>

                            <button
                              onClick={() => onSelectAppointment(apt)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Detalii</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
