import React, { useState, useRef } from 'react';
import { 
  Appointment, 
  AppointmentStatus, 
  PhotoItem, 
  ServiceNote, 
  Team 
} from '../types/hvac';
import { 
  formatLongRomanianDate, 
  formatRomanianDate, 
  getStatusBadge, 
  getPriorityBadge, 
  getTeamName 
} from '../utils/formatters';
import { 
  X, 
  Phone, 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  Wrench, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  Camera, 
  Plus, 
  Send, 
  MessageSquare, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  ArrowRightLeft,
  Image as ImageIcon
} from 'lucide-react';

interface InterventionDetailModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onAddNote: (appointmentId: string, text: string, author: string) => void;
  onAddPhoto: (appointmentId: string, photo: Omit<PhotoItem, 'id' | 'timestamp'>) => void;
  onReassignTeam: (appointmentId: string, teamId: 'echipa-1' | 'echipa-2' | 'neasignat') => void;
  onReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
  onOpenReport: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
  teams: Team[];
}

export const InterventionDetailModal: React.FC<InterventionDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
  onAddPhoto,
  onReassignTeam,
  onReschedule,
  onOpenReport,
  onEdit,
  onDelete,
  teams,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Tehnician');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoType, setPhotoType] = useState<'before' | 'after' | 'diagnostic'>('diagnostic');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !appointment) return null;

  const statusInfo = getStatusBadge(appointment.status);
  const priorityInfo = getPriorityBadge(appointment.priority);

  // Address query for Google Maps navigation
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${appointment.address}, ${appointment.sector}, Bucuresti, Romania`
  )}`;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(appointment.id, newNoteText.trim(), noteAuthor);
    setNewNoteText('');
  };

  const handleStartReschedule = () => {
    setRescheduleDate(appointment.date);
    setRescheduleTime(appointment.startTime);
    setIsRescheduling(true);
  };

  const handleSaveReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    onReschedule(appointment.id, rescheduleDate, rescheduleTime);
    setIsRescheduling(false);
  };

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onAddPhoto(appointment.id, {
        type: photoType,
        caption: photoCaption.trim() || 'Poză constatare teren HVAC',
        url: result,
      });
      setShowPhotoModal(false);
      setPhotoCaption('');
    };
    reader.readAsDataURL(file);
  };

  // Add demo preset photo
  const handleAddPresetPhoto = (sampleUrl: string, sampleCaption: string) => {
    onAddPhoto(appointment.id, {
      type: photoType,
      caption: photoCaption.trim() || sampleCaption,
      url: sampleUrl,
    });
    setShowPhotoModal(false);
    setPhotoCaption('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6 animate-in fade-in duration-150 flex flex-col max-h-[92vh]"
        role="dialog"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-3 py-1 rounded-full border font-bold flex items-center gap-1.5 ${statusInfo.bg}`}>
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </span>

            {appointment.priority === 'urgent' && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${priorityInfo.badgeClass} flex items-center gap-1`}>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Urgentă
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(appointment)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              title="Editează detaliile"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm(`Sigur doriți să ștergeți intervenția pentru ${appointment.clientName}?`)) {
                  onDelete(appointment.id);
                  onClose();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Șterge intervenția"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Status Progression Workflow Actions Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Flux de lucru pe teren
              </span>
              <span className="text-xs text-blue-400 font-mono">
                ID: {appointment.id}
              </span>
            </div>

            {/* Transition Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Button 1: Start Intervention */}
              {appointment.status === 'programata' && (
                <button
                  onClick={() => onUpdateStatus(appointment.id, 'in_desfasurare')}
                  className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Pornește intervenția</span>
                </button>
              )}

              {/* Button 2: Mark Finished (Opens Report Form) */}
              {appointment.status === 'in_desfasurare' && (
                <button
                  onClick={() => onOpenReport(appointment)}
                  className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Marchează ca finalizată & Raport</span>
                </button>
              )}

              {/* Button 3: View Report if already completed */}
              {appointment.status === 'finalizata' && (
                <button
                  onClick={() => onOpenReport(appointment)}
                  className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Vezi & Printează Raport Tehnic</span>
                </button>
              )}

              {/* Button 4: Reschedule */}
              <button
                onClick={handleStartReschedule}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Reprogramează</span>
              </button>

              {/* If completed, option to re-open */}
              {appointment.status === 'finalizata' && (
                <button
                  onClick={() => onUpdateStatus(appointment.id, 'in_desfasurare')}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                  title="Re-deschide dacă au apărut completări"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  Re-deschide
                </button>
              )}
            </div>

            {/* Rescheduling Form Panel */}
            {isRescheduling && (
              <div className="bg-slate-800 p-3.5 rounded-lg border border-slate-700 space-y-3 mt-2 animate-in fade-in">
                <span className="text-xs font-bold text-amber-300 block">
                  Selectați noua dată și oră:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="px-3 py-2 bg-slate-900 text-white text-xs rounded-lg border border-slate-700 focus:outline-none"
                  />
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="px-3 py-2 bg-slate-900 text-white text-xs rounded-lg border border-slate-700 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsRescheduling(false)}
                    className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleSaveReschedule}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Confirmă Reprogramarea
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Client & Location Card */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Beneficiar & Locație
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {appointment.clientName}
                </h3>
              </div>

              {/* Direct call button with phone */}
              <a
                href={`tel:${appointment.clientPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Apelează: {appointment.clientPhone}</span>
              </a>
            </div>

            {/* Address & Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{appointment.address}</p>
                  <p className="text-xs text-slate-500">{appointment.sector}, București</p>
                </div>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-600 text-slate-800 font-semibold text-xs rounded-lg shadow-2xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Navighează (Google Maps)</span>
              </a>
            </div>

            {appointment.additionalNotes && (
              <div className="text-xs bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-lg text-amber-900">
                <span className="font-bold">Notițe acces / interfon:</span> {appointment.additionalNotes}
              </div>
            )}
          </div>

          {/* Appointment Timing & Team Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Timing */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Data & Interval Orar
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{formatLongRomanianDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Ora {appointment.startTime} (Durată estimată: {appointment.estimatedDuration})</span>
              </div>
            </div>

            {/* Team Assignment with Quick Reassignment Switch */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Echipă Alocată
                </span>
                <span className="text-xs text-slate-500">Reasignează:</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={appointment.assignedTeamId}
                  onChange={(e) => onReassignTeam(appointment.id, e.target.value as any)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="echipa-1">Echipa 1 (Andrei Popescu & Mihai Ionescu)</option>
                  <option value="echipa-2">Echipa 2 (Radu Marinescu & Vlad Dumitrescu)</option>
                  <option value="neasignat">Neasignată</option>
                </select>
              </div>

              {appointment.assignedTechnicianName && (
                <p className="text-xs text-slate-500">
                  Tehnician desemnat: <strong>{appointment.assignedTechnicianName}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Problem & Equipment Description */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Defecțiune & Echipament
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700">
                {appointment.equipmentType}
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {appointment.problemDescription}
            </p>
          </div>

          {/* Before & After Photos Gallery */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-600" />
                <h4 className="font-bold text-sm text-slate-900">
                  Fotografii constatare & Lucrări ({appointment.photos.length})
                </h4>
              </div>

              <button
                onClick={() => setShowPhotoModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adaugă poză</span>
              </button>
            </div>

            {appointment.photos.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                Nicio fotografie atașată. Tehnicienii pot încărca poze cu starea inițială și după remediere.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appointment.photos.map((ph) => (
                  <div key={ph.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={ph.url}
                        alt={ph.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm text-white ${
                        ph.type === 'before' 
                          ? 'bg-rose-600' 
                          : ph.type === 'after' 
                          ? 'bg-emerald-600' 
                          : 'bg-blue-600'
                      }`}>
                        {ph.type === 'before' ? 'Înainte' : ph.type === 'after' ? 'După lucrare' : 'Diagnostic'}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">{ph.caption}</p>
                      <span className="text-[10px] text-slate-400">{ph.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Notes & Field History Log */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <h4 className="font-bold text-sm text-slate-900">
                Jurnal & Notițe de Teren ({appointment.notes.length})
              </h4>
            </div>

            {/* Existing Notes list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {appointment.notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Nu există notițe înregistrate încă.</p>
              ) : (
                appointment.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{note.author}</span>
                      <span className="text-slate-400 font-mono">{note.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-snug">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add note input form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700">Adaugă notiță nouă:</span>
                <select
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-white"
                >
                  <option value="Tehnician">Tehnician</option>
                  <option value="Dispecerat">Dispecerat</option>
                  <option value="Client (Telefon)">Client (Telefon)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Scrie o notiță (ex: clientul a confirmat sosirea la 11:30)..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Trimite</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Creat la: {appointment.createdAt}
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Închide
          </button>
        </div>
      </div>

      {/* Photo Add Submodal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">Atașează fotografie intervenție</h4>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tip fotografie</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoType('before')}
                    className={`py-1.5 text-xs rounded-lg font-bold border ${
                      photoType === 'before' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200'
                    }`}
                  >
                    Înainte
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoType('after')}
                    className={`py-1.5 text-xs rounded-lg font-bold border ${
                      photoType === 'after' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200'
                    }`}
                  >
                    După
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoType('diagnostic')}
                    className={`py-1.5 text-xs rounded-lg font-bold border ${
                      photoType === 'diagnostic' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200'
                    }`}
                  >
                    Constatare
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descriere / Legendă foto</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="ex: Curățare evaporator și filtre split"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              {/* Upload file from device */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Alege din telefon / Fă o poză</span>
                </button>
              </div>

              {/* Or Quick Demo Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">Sau adaugă o poză demonstrativă HVAC:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleAddPresetPhoto(
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
                      'Baterie manometre presiune agent frigorific'
                    )}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
                  >
                    Baterie Manometre
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetPhoto(
                      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
                      'Filtre igienizate după spălare chimică'
                    )}
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-left font-medium text-slate-700"
                  >
                    Filtre Curățate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
