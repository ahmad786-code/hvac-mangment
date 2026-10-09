import React from 'react';
import { 
  Appointment, 
  Team, 
  AppointmentStatus 
} from '../types/hvac';
import { 
  formatLongRomanianDate, 
  getStatusBadge, 
  getPriorityBadge, 
  getTeamName 
} from '../utils/formatters';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Play, 
  FileText, 
  ArrowRight, 
  Truck, 
  UserCheck, 
  ChevronRight,
  Plus
} from 'lucide-react';

interface DashboardTodayProps {
  todayAppointments: Appointment[];
  teams: Team[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointment: () => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onOpenReport: (appointment: Appointment) => void;
  onResetDemo: () => void;
}

export const DashboardToday: React.FC<DashboardTodayProps> = ({
  todayAppointments,
  teams,
  onSelectAppointment,
  onNewAppointment,
  onUpdateStatus,
  onOpenReport,
  onResetDemo,
}) => {
  // Today's date string
  const today = new Date();
  const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const formattedToday = formatLongRomanianDate(todayDateStr);

  // Compute counters
  const totalCount = todayAppointments.length;
  const inProgressCount = todayAppointments.filter((a) => a.status === 'in_desfasurare').length;
  const scheduledCount = todayAppointments.filter((a) => a.status === 'programata').length;
  const completedCount = todayAppointments.filter((a) => a.status === 'finalizata').length;
  const unassignedCount = todayAppointments.filter((a) => a.assignedTeamId === 'neasignat').length;
  const urgentCount = todayAppointments.filter((a) => a.priority === 'urgent' && a.status !== 'finalizata').length;

  // Sort appointments by start time ascending
  const sortedAppointments = [...todayAppointments].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Date Header & Quick Summary */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wide uppercase">
              <Calendar className="w-4 h-4" />
              <span>Programul de astăzi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 capitalize mt-0.5">
              {formattedToday}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {totalCount} {totalCount === 1 ? 'intervenție' : 'intervenții'} în total
            </span>
            {urgentCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {urgentCount} {urgentCount === 1 ? 'urgență activă' : 'urgențe active'}
              </span>
            )}
          </div>
        </div>

        {/* Counter KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Scheduled */}
          <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 sm:p-4 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900">Programate</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-950">{scheduledCount}</span>
              <span className="text-xs text-amber-700 font-medium">intervenții</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3 sm:p-4 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900">În desfășurare</span>
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-950">{inProgressCount}</span>
              <span className="text-xs text-blue-700 font-medium">pe teren</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-3 sm:p-4 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-900">Finalizate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">{completedCount}</span>
              <span className="text-xs text-emerald-700 font-medium">realizate</span>
            </div>
          </div>

          {/* Unassigned */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">Nealocate</span>
              <UserCheck className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{unassignedCount}</span>
              <span className="text-xs text-slate-600 font-medium">de distribuit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Quick Status Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-slate-700" />
            <span>Echipe de intervenție ({teams.length})</span>
          </h3>
          <span className="text-xs text-slate-500">2 tehnicieni / echipă</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => {
            const teamJobs = todayAppointments.filter((a) => a.assignedTeamId === team.id);
            const teamCompleted = teamJobs.filter((a) => a.status === 'finalizata').length;
            const teamInProgress = teamJobs.find((a) => a.status === 'in_desfasurare');
            const teamNext = teamJobs.find((a) => a.status === 'programata');

            return (
              <div 
                key={team.id}
                className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${team.id === 'echipa-1' ? 'bg-blue-600' : 'bg-emerald-600'}`} />
                      <h4 className="font-bold text-slate-900 text-base">{team.name}</h4>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {team.vehicle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {team.technicians.map((t) => t.name).join(' • ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {teamCompleted}/{teamJobs.length} finalizate
                    </span>
                  </div>
                </div>

                {/* Current or Next Activity */}
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                  {teamInProgress ? (
                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50/70 p-2 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                      <span className="font-semibold">Acum:</span>
                      <span className="truncate">{teamInProgress.startTime} - {teamInProgress.clientName}</span>
                    </div>
                  ) : teamNext ? (
                    <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-semibold">Următoarea:</span>
                      <span className="truncate">{teamNext.startTime} - {teamNext.clientName} ({teamNext.sector})</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic p-1">
                      Nicio intervenție rămasă pentru astăzi.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments Timeline / List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Intervențiile de astăzi
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {sortedAppointments.length}
            </span>
          </div>

          <button
            onClick={onNewAppointment}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>+ Adaugă</span>
          </button>
        </div>

        {sortedAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-base">Nu există intervenții programate pentru astăzi</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Puteți înregistra o nouă solicitare sau puteți reîncărca datele demo cu scenarii gata pregătite.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onNewAppointment}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                + Programare nouă
              </button>
              <button
                onClick={onResetDemo}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium cursor-pointer"
              >
                Reîncarcă date demo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAppointments.map((apt) => {
              const statusInfo = getStatusBadge(apt.status);
              const priorityInfo = getPriorityBadge(apt.priority);

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    {/* Top Row: Time, Status, Priority */}
                    <div className="flex items-start justify-between gap-2 flex-wrap pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-sm">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>{apt.startTime}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          ({apt.estimatedDuration})
                        </span>
                        {apt.priority === 'urgent' && (
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${priorityInfo.badgeClass} flex items-center gap-1`}>
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Urgentă
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${statusInfo.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Middle Info: Client, Address, Issue */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                          {apt.clientName}
                        </h4>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                          {apt.equipmentType}
                        </span>
                      </div>

                      {/* Address with Sector */}
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{apt.address}</span>
                        <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-xs shrink-0">
                          {apt.sector}
                        </span>
                      </div>

                      {/* Problem Description */}
                      <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-snug">
                        {apt.problemDescription}
                      </p>
                    </div>

                    {/* Footer Row: Team assignment & Quick Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Assigned Team */}
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-slate-400 font-medium">Alocat:</span>
                        <span className={`font-semibold px-2 py-0.5 rounded ${
                          apt.assignedTeamId === 'echipa-1'
                            ? 'bg-blue-100 text-blue-800'
                            : apt.assignedTeamId === 'echipa-2'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {getTeamName(apt.assignedTeamId)}
                        </span>
                        {apt.assignedTechnicianName && (
                          <span className="text-slate-500 hidden xs:inline">
                            • {apt.assignedTechnicianName}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Quick call link */}
                        <a
                          href={`tel:${apt.clientPhone.replace(/\s+/g, '')}`}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          title={`Apelează clientul: ${apt.clientPhone}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-4 h-4 text-emerald-600" />
                        </a>

                        {/* Status Transition Shortcut */}
                        {apt.status === 'programata' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'in_desfasurare')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Pornește intervenția"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Pornește</span>
                          </button>
                        )}

                        {apt.status === 'in_desfasurare' && (
                          <button
                            onClick={() => onOpenReport(apt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Completează raportul de service și finalizează"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Finalizează</span>
                          </button>
                        )}

                        {apt.status === 'finalizata' && apt.serviceReport && (
                          <button
                            onClick={() => onOpenReport(apt)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            title="Deschide fișa de intervenție"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Raport</span>
                          </button>
                        )}

                        {/* View full details button */}
                        <button
                          onClick={() => onSelectAppointment(apt)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <span>Detalii</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
