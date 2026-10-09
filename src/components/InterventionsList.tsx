import React, { useState, useMemo } from 'react';
import { 
  Appointment, 
  AppointmentStatus, 
  PriorityLevel 
} from '../types/hvac';
import { 
  formatLongRomanianDate, 
  formatRomanianDate, 
  getDayLabel, 
  getStatusBadge, 
  getPriorityBadge, 
  getTeamName 
} from '../utils/formatters';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Plus, 
  ChevronRight, 
  Trash2, 
  Edit3, 
  FileText 
} from 'lucide-react';

interface InterventionsListProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onNewAppointment: () => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onOpenReport: (appointment: Appointment) => void;
}

export const InterventionsList: React.FC<InterventionsListProps> = ({
  appointments,
  onSelectAppointment,
  onNewAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onOpenReport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'toate' | 'azi' | 'maine' | 'viitoare'>('toate');
  const [teamFilter, setTeamFilter] = useState<'toate' | 'echipa-1' | 'echipa-2' | 'neasignat'>('toate');
  const [statusFilter, setStatusFilter] = useState<'toate' | AppointmentStatus>('toate');
  const [priorityFilter, setPriorityFilter] = useState<'toate' | PriorityLevel>('toate');

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  // Filtered and searched list
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesClient = apt.clientName.toLowerCase().includes(query);
        const matchesPhone = apt.clientPhone.toLowerCase().includes(query);
        const matchesAddress = apt.address.toLowerCase().includes(query);
        const matchesSector = apt.sector.toLowerCase().includes(query);
        const matchesDesc = apt.problemDescription.toLowerCase().includes(query);
        const matchesEquip = apt.equipmentType.toLowerCase().includes(query);

        if (!matchesClient && !matchesPhone && !matchesAddress && !matchesSector && !matchesDesc && !matchesEquip) {
          return false;
        }
      }

      // Date filter
      if (dateFilter === 'azi' && apt.date !== todayStr) return false;
      if (dateFilter === 'maine' && apt.date !== tomorrowStr) return false;
      if (dateFilter === 'viitoare' && apt.date < todayStr) return false;

      // Team filter
      if (teamFilter !== 'toate' && apt.assignedTeamId !== teamFilter) return false;

      // Status filter
      if (statusFilter !== 'toate' && apt.status !== statusFilter) return false;

      // Priority filter
      if (priorityFilter !== 'toate' && apt.priority !== priorityFilter) return false;

      return true;
    }).sort((a, b) => {
      // Sort by date then start time
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [appointments, searchTerm, dateFilter, teamFilter, statusFilter, priorityFilter, todayStr, tomorrowStr]);

  const hasActiveFilters = searchTerm !== '' || dateFilter !== 'toate' || teamFilter !== 'toate' || statusFilter !== 'toate' || priorityFilter !== 'toate';

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter('toate');
    setTeamFilter('toate');
    setStatusFilter('toate');
    setPriorityFilter('toate');
  };

  return (
    <div className="space-y-4 pb-24 md:pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Toate Intervențiile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Căutare, filtrare și gestiunea tuturor programărilor din sistem
          </p>
        </div>

        <button
          onClick={onNewAppointment}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Programare nouă</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Caută după client, adresă, sector, telefon sau problemă..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm bg-slate-50/50 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="toate">Dată: Toate</option>
            <option value="azi">Dată: Azi</option>
            <option value="maine">Dată: Mâine</option>
            <option value="viitoare">Dată: Următoarele</option>
          </select>

          {/* Team Filter */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="toate">Echipă: Toate</option>
            <option value="echipa-1">Echipa 1</option>
            <option value="echipa-2">Echipa 2</option>
            <option value="neasignat">Neasignată</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="toate">Status: Toate</option>
            <option value="programata">Programată</option>
            <option value="in_desfasurare">În desfășurare</option>
            <option value="finalizata">Finalizată</option>
            <option value="reprogramata">Reprogramată</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="toate">Prioritate: Toate</option>
            <option value="urgent">Doar Urgente</option>
            <option value="normal">Normală</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Resetează filtre</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-500">
        <span>
          Afișare <strong>{filteredAppointments.length}</strong> din {appointments.length} intervenții
        </span>
      </div>

      {/* Appointment Cards List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">Nicio intervenție găsită</h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Nu a fost găsit niciun rezultat conform filtrelor selectate. Încercați să resetați căutarea sau filtrele.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Resetează toate filtrele
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((apt) => {
            const statusInfo = getStatusBadge(apt.status);
            const priorityInfo = getPriorityBadge(apt.priority);
            const dayLabel = getDayLabel(apt.date);

            return (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  {/* Top Bar: Date, Time, Status, Priority */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs sm:text-sm">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>{apt.startTime}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {dayLabel} • {formatRomanianDate(apt.date)}
                      </span>
                      {apt.priority === 'urgent' && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${priorityInfo.badgeClass} flex items-center gap-1`}>
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Urgentă
                        </span>
                      )}
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${statusInfo.bg}`}>
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Client & Address Info */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                        {apt.clientName}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {apt.equipmentType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{apt.address}</span>
                      <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-xs shrink-0">
                        {apt.sector}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-2 mt-2">
                      {apt.problemDescription}
                    </p>
                  </div>

                  {/* Footer Row: Team & Actions */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="text-slate-400 font-medium">Echipă:</span>
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
                        <span className="text-slate-500 hidden sm:inline">
                          ({apt.assignedTechnicianName})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Phone call shortcut */}
                      <a
                        href={`tel:${apt.clientPhone.replace(/\s+/g, '')}`}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title={`Apelează: ${apt.clientPhone}`}
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                      </a>

                      {/* Report button if completed */}
                      {apt.status === 'finalizata' && apt.serviceReport && (
                        <button
                          onClick={() => onOpenReport(apt)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          title="Vezi fișa de intervenție"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Raport</span>
                        </button>
                      )}

                      {/* Edit button */}
                      <button
                        onClick={() => onEditAppointment(apt)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title="Editează programarea"
                      >
                        <Edit3 className="w-4 h-4 text-slate-600" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Sunteți sigur că doriți să ștergeți intervenția pentru ${apt.clientName}?`)) {
                            onDeleteAppointment(apt.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        title="Șterge programarea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* View Details */}
                      <button
                        onClick={() => onSelectAppointment(apt)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
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
  );
};
