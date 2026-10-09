import React, { useState, useEffect } from 'react';
import { 
  Appointment, 
  EquipmentType, 
  PriorityLevel, 
  Team 
} from '../types/hvac';
import { 
  X, 
  Save, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Wrench, 
  Users 
} from 'lucide-react';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
  editingAppointment?: Appointment | null;
  teams: Team[];
}

const BUCHAREST_SECTORS = [
  'Sector 1',
  'Sector 2',
  'Sector 3',
  'Sector 4',
  'Sector 5',
  'Sector 6',
  'Ilfov Nord',
  'Ilfov Sud',
];

const EQUIPMENT_TYPES: EquipmentType[] = [
  'Aer Condiționat Split',
  'Aer Condiționat Multi-Split',
  'Centrală Termică pe Gaz',
  'Sistem VRV / VRF Comercial',
  'Pompă de Căldură',
  'Ventiloconvector / Chiller',
];

// Presets for quick 1-click test during sales presentation demo
const QUICK_PRESETS = [
  {
    label: 'Revizie AC (Standard)',
    clientName: 'Mihai Georgescu',
    phone: '+40 722 987 654',
    address: 'Str. Ion Câmpineanu 21, Et. 3',
    sector: 'Sector 1',
    equipmentType: 'Aer Condiționat Split' as EquipmentType,
    description: 'Revizie periodică de primăvară/vară, igienizare profesională a filtrelor și verificare nivel agent frigorific.',
    duration: '1.5 ore',
    priority: 'normal' as PriorityLevel,
  },
  {
    label: 'Urgență: Scurgere apă',
    clientName: 'Ana Maria Preda',
    phone: '+40 735 112 233',
    address: 'Calea Dorobanți 110, Ap. 12',
    sector: 'Sector 1',
    equipmentType: 'Aer Condiționat Split' as EquipmentType,
    description: 'Scurgere masivă de apă din unitatea internă direct pe mobila de bucătărie. Solicită intervenție rapidă.',
    duration: '1 oră',
    priority: 'urgent' as PriorityLevel,
  },
  {
    label: 'Centrală: Fără apă caldă',
    clientName: 'Restaurant Trattoria Bella',
    phone: '+40 740 556 677',
    address: 'Bd. Dimitrie Cantemir 14, Parter',
    sector: 'Sector 4',
    equipmentType: 'Centrală Termică pe Gaz' as EquipmentType,
    description: 'Centrala intră în avarie la pornirea apei calde menajere. Bucătăria restaurantului este blocată.',
    duration: '2 ore',
    priority: 'urgent' as PriorityLevel,
  },
];

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAppointment,
  teams,
}) => {
  const isEditing = !!editingAppointment;

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [address, setAddress] = useState('');
  const [sector, setSector] = useState('Sector 1');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [estimatedDuration, setEstimatedDuration] = useState('1.5 ore');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('Aer Condiționat Split');
  const [problemDescription, setProblemDescription] = useState('');
  const [assignedTeamId, setAssignedTeamId] = useState<'echipa-1' | 'echipa-2' | 'neasignat'>('echipa-1');
  const [assignedTechnicianName, setAssignedTechnicianName] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset or fill form on open/change
  useEffect(() => {
    if (editingAppointment) {
      setClientName(editingAppointment.clientName || '');
      setClientPhone(editingAppointment.clientPhone || '');
      setClientEmail(editingAppointment.clientEmail || '');
      setAddress(editingAppointment.address || '');
      setSector(editingAppointment.sector || 'Sector 1');
      setDate(editingAppointment.date || '');
      setStartTime(editingAppointment.startTime || '10:00');
      setEstimatedDuration(editingAppointment.estimatedDuration || '1.5 ore');
      setEquipmentType(editingAppointment.equipmentType || 'Aer Condiționat Split');
      setProblemDescription(editingAppointment.problemDescription || '');
      setAssignedTeamId(editingAppointment.assignedTeamId || 'echipa-1');
      setAssignedTechnicianName(editingAppointment.assignedTechnicianName || '');
      setPriority(editingAppointment.priority || 'normal');
      setAdditionalNotes(editingAppointment.additionalNotes || '');
    } else {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      // Default to next full hour
      const nextHour = String(Math.min(now.getHours() + 1, 20)).padStart(2, '0');
      
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setAddress('');
      setSector('Sector 1');
      setDate(todayStr);
      setStartTime(`${nextHour}:00`);
      setEstimatedDuration('1.5 ore');
      setEquipmentType('Aer Condiționat Split');
      setProblemDescription('');
      setAssignedTeamId('echipa-1');
      setAssignedTechnicianName('Andrei Popescu');
      setPriority('normal');
      setAdditionalNotes('');
    }
    setErrors({});
  }, [editingAppointment, isOpen]);

  // Update technician name when team changes
  const handleTeamChange = (teamId: 'echipa-1' | 'echipa-2' | 'neasignat') => {
    setAssignedTeamId(teamId);
    if (teamId === 'echipa-1') {
      setAssignedTechnicianName('Andrei Popescu');
    } else if (teamId === 'echipa-2') {
      setAssignedTechnicianName('Radu Marinescu');
    } else {
      setAssignedTechnicianName('');
    }
  };

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setClientName(preset.clientName);
    setClientPhone(preset.phone);
    setAddress(preset.address);
    setSector(preset.sector);
    setEquipmentType(preset.equipmentType);
    setProblemDescription(preset.description);
    setEstimatedDuration(preset.duration);
    setPriority(preset.priority);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!clientName.trim()) {
      newErrors.clientName = 'Numele clientului este obligatoriu.';
    }

    if (!clientPhone.trim()) {
      newErrors.clientPhone = 'Numărul de telefon este obligatoriu.';
    } else if (clientPhone.trim().length < 8) {
      newErrors.clientPhone = 'Introduceți un număr de telefon valid.';
    }

    if (!address.trim()) {
      newErrors.address = 'Adresa locației este obligatorie.';
    }

    if (!date.trim()) {
      newErrors.date = 'Data programării este obligatorie.';
    }

    if (!startTime.trim()) {
      newErrors.startTime = 'Ora începerii este obligatorie.';
    }

    if (!problemDescription.trim()) {
      newErrors.problemDescription = 'Descrierea defecțiunii/intervenției este obligatorie.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      address: address.trim(),
      sector,
      date,
      startTime,
      estimatedDuration,
      equipmentType,
      problemDescription: problemDescription.trim(),
      assignedTeamId,
      assignedTechnicianName: assignedTechnicianName || undefined,
      priority,
      status: editingAppointment ? editingAppointment.status : 'programata',
      additionalNotes: additionalNotes.trim() || undefined,
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">
              {isEditing ? 'Editează Programarea' : 'Înregistrare Programare Nouă'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing 
                ? 'Actualizează detaliile clientului sau echipei alocate' 
                : 'Completează datele apelului telefonic de la client'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets for Demo Mode */}
        {!isEditing && (
          <div className="px-5 py-2.5 bg-blue-50/50 border-b border-blue-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Scenarii rapide pentru demo:
            </span>
            {QUICK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-xs px-2.5 py-1 rounded-md bg-white border border-blue-200 hover:border-blue-400 text-blue-800 font-medium transition-colors shadow-2xs cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section: Date Client */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Informații Client</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nume client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nume client / Companie <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ex: Andrei Ionescu sau S.C. Bistro S.R.L."
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    errors.clientName ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-blue-600`}
                />
                {errors.clientName && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.clientName}</p>
                )}
              </div>

              {/* Telefon client */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefon de contact <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="ex: +40 721 234 567"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                      errors.clientPhone ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                    } focus:outline-none focus:border-blue-600`}
                  />
                </div>
                {errors.clientPhone && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.clientPhone}</p>
                )}
              </div>
            </div>

            {/* Adresă și Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresă intervenție (Stradă, număr, bloc, apt) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="ex: Bd. Decebal 14, Bl. S2, Ap. 18"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                      errors.address ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                    } focus:outline-none focus:border-blue-600`}
                  />
                </div>
                {errors.address && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sector / Zonă <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white cursor-pointer"
                >
                  {BUCHAREST_SECTORS.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Dată & Programare */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Programare & Prioritate</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dată */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Data programării <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    errors.date ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-blue-600 cursor-pointer`}
                />
                {errors.date && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>
                )}
              </div>

              {/* Ora începere */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ora începerii (24h) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl border ${
                    errors.startTime ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-blue-600 cursor-pointer`}
                />
                {errors.startTime && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.startTime}</p>
                )}
              </div>

              {/* Durată estimată */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Durată estimată
                </label>
                <select
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white cursor-pointer"
                >
                  <option value="45 min">45 min</option>
                  <option value="1 oră">1 oră</option>
                  <option value="1.5 ore">1.5 ore</option>
                  <option value="2 ore">2 ore</option>
                  <option value="2.5 ore">2.5 ore</option>
                  <option value="3 ore">3 ore</option>
                  <option value="4 ore+">4 ore (lucrare mare)</option>
                </select>
              </div>
            </div>

            {/* Prioritate */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-bold text-slate-700">Grad de Urgență:</span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={priority === 'normal'}
                  onChange={() => setPriority('normal')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Normală</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={priority === 'urgent'}
                  onChange={() => setPriority('urgent')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Urgentă (Avarie / Pierdere apă)</span>
              </label>
            </div>
          </div>

          {/* Section: Echipă & Echipament */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Echipă & Descriere Defecțiune</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Tip echipament */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tip echipament HVAC
                </label>
                <select
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value as EquipmentType)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white cursor-pointer"
                >
                  {EQUIPMENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Alocare echipă */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alocare echipă de intervenție
                </label>
                <select
                  value={assignedTeamId}
                  onChange={(e) => handleTeamChange(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white cursor-pointer font-medium"
                >
                  <option value="echipa-1">Echipa 1 (Andrei Popescu & Mihai Ionescu)</option>
                  <option value="echipa-2">Echipa 2 (Radu Marinescu & Vlad Dumitrescu)</option>
                  <option value="neasignat">-- Fără echipă alocată (Neasignat) --</option>
                </select>
              </div>
            </div>

            {/* Descriere problemă */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descrierea problemei / solicitării <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="ex: Unitatea nu răcește, aerul este călduț, clientul a observat scurgere la îmbinare..."
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.problemDescription ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200'
                } focus:outline-none focus:border-blue-600`}
              />
              {errors.problemDescription && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.problemDescription}</p>
              )}
            </div>

            {/* Notițe suplimentare */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notițe suplimentare / Instrucțiuni acces (Opțional)
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="ex: Interfon 12, loc parcare în curte, cheia e la paznic..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvează Modificările' : 'Înregistrează Programarea'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
