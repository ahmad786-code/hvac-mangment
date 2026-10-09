import React, { useState, useEffect } from 'react';
import { 
  Appointment, 
  ServiceReportData, 
  Team 
} from '../types/hvac';
import { 
  formatCurrency, 
  formatLongRomanianDate, 
  getTeamName 
} from '../utils/formatters';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FileText, 
  Sparkles,
  Wrench,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  MapPin
} from 'lucide-react';

interface ServiceReportModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveReport: (appointmentId: string, reportData: ServiceReportData) => void;
  teams: Team[];
}

export const ServiceReportModal: React.FC<ServiceReportModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSaveReport,
  teams,
}) => {
  if (!isOpen || !appointment) return null;

  const isAlreadyCompleted = appointment.status === 'finalizata' && !!appointment.serviceReport;

  // Form states for completion
  const [diagnosis, setDiagnosis] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [materials, setMaterials] = useState<Array<{ name: string; quantity: string; unitPrice?: number }>>([
    { name: '', quantity: '1 buc', unitPrice: 0 },
  ]);
  const [recommendations, setRecommendations] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [laborCost, setLaborCost] = useState<number>(250);
  const [technicianSignatureName, setTechnicianSignatureName] = useState(
    appointment.assignedTechnicianName || 'Andrei Popescu'
  );

  // Initialize from existing report if available
  useEffect(() => {
    if (appointment.serviceReport) {
      setDiagnosis(appointment.serviceReport.diagnosis || '');
      setWorkPerformed(appointment.serviceReport.workPerformed || '');
      setMaterials(appointment.serviceReport.materialsUsed && appointment.serviceReport.materialsUsed.length > 0 
        ? appointment.serviceReport.materialsUsed 
        : [{ name: '', quantity: '1 buc', unitPrice: 0 }]);
      setRecommendations(appointment.serviceReport.recommendations || '');
      setCompletionNotes(appointment.serviceReport.completionNotes || '');
      setLaborCost(appointment.serviceReport.laborCost || 250);
      setTechnicianSignatureName(appointment.serviceReport.technicianSignatureName || appointment.assignedTechnicianName || 'Tehnician HVAC');
    } else {
      // Prefill with smart defaults based on issue
      setDiagnosis(
        `Echipament ${appointment.equipmentType} inspectat. Constatat stare de funcționare și parametri termici conform fișei tehnice.`
      );
      setWorkPerformed(
        `Efectuat revizie completă, verificare etanșeitate traseu frigorific, curățare filtre și igienizare tratament antibacterian.`
      );
      setMaterials([
        { name: 'Soluție curățare profesională evaporator', quantity: '1 buc', unitPrice: 55 },
        { name: 'Igienizant spray cu spectru larg', quantity: '1 buc', unitPrice: 40 },
      ]);
      setRecommendations(
        'Verificare periodică recomandată la fiecare 6 luni pentru menținerea eficienței energetice.'
      );
      setCompletionNotes(
        'Proba de funcționare a fost efectuată în prezența clientului. Parametrii sunt în cotele normale de operare.'
      );
      setLaborCost(250);
      setTechnicianSignatureName(appointment.assignedTechnicianName || 'Andrei Popescu');
    }
  }, [appointment]);

  // Compute materials total cost
  const partsTotal = materials.reduce((acc, curr) => {
    if (curr.name && curr.unitPrice) {
      return acc + (Number(curr.unitPrice) || 0);
    }
    return acc;
  }, 0);

  const totalCost = laborCost + partsTotal;

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: '', quantity: '1 buc', unitPrice: 0 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, idx) => idx !== index));
  };

  const handleMaterialChange = (index: number, field: string, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredMaterials = materials.filter((m) => m.name.trim() !== '');

    const reportData: ServiceReportData = {
      diagnosis: diagnosis.trim(),
      workPerformed: workPerformed.trim(),
      materialsUsed: filteredMaterials,
      recommendations: recommendations.trim(),
      completionNotes: completionNotes.trim(),
      laborCost: Number(laborCost) || 0,
      partsCost: partsTotal,
      technicianSignatureName,
    };

    onSaveReport(appointment.id, reportData);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[94vh] flex flex-col animate-in fade-in"
        role="dialog"
      >
        {/* Header - Not printed */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Raport de Service & Recepție Tehnică
              </h3>
              <p className="text-xs text-slate-500">
                Fișă de intervenție HVAC oficială cu listă de materiale și manoperă
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printează raportul</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form or View Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 print-page">
          {/* Printable Document Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  SERVICEFLOW HVAC BUCUREȘTI
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Service, Mentenanță & Climatizare Profesională
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  CIF: RO38920145 • Reg. Com: J40/1234/2021 • Dispecerat: +40 720 000 111
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-mono font-bold rounded">
                  FIȘĂ #{appointment.id.toUpperCase()}
                </span>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Data: {formatLongRomanianDate(appointment.date)}
                </p>
              </div>
            </div>
          </div>

          {/* Client & Equipment Summary Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Beneficiar
              </span>
              <p className="font-extrabold text-slate-900 text-sm">{appointment.clientName}</p>
              <p className="text-slate-600">{appointment.address}</p>
              <p className="text-slate-600">{appointment.sector}, București</p>
              <p className="text-slate-600 font-mono mt-0.5">Tel: {appointment.clientPhone}</p>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Echipă Intervenție & Echipament
              </span>
              <p className="font-bold text-slate-900">
                {getTeamName(appointment.assignedTeamId)}
              </p>
              <p className="text-slate-700">
                Tehnician responsabil: <strong>{technicianSignatureName}</strong>
              </p>
              <p className="text-slate-700 mt-1">
                Tip sistem: <strong>{appointment.equipmentType}</strong>
              </p>
              <p className="text-slate-500 text-[11px]">
                Ora intervenție: {appointment.startTime}
              </p>
            </div>
          </div>

          {/* If already completed, show clean printable view; else show editable form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Diagnosis / Constatări */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                1. Diagnosticare și Constatări Tehnice
              </label>
              <textarea
                rows={2}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                placeholder="Descrieți starea constatată la fața locului (parametri presiune, erori semnalate, scurgeri etc.)..."
              />
            </div>

            {/* Work Performed / Lucrări Efectuate */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                2. Lucrări Efectuate (Manoperă)
              </label>
              <textarea
                rows={3}
                value={workPerformed}
                onChange={(e) => setWorkPerformed(e.target.value)}
                required
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                placeholder="Enumerați operațiunile realizate (demontare, curățare chimică, vidat, încărcare freon, probe etc.)..."
              />
            </div>

            {/* Materials Used / Piese și Materiale */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Piese de Schimb și Materiale Consumate
                </label>
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 no-print cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Adaugă piesă/material</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Denumire Material / Piesă</th>
                      <th className="p-2.5 w-24">Cantitate</th>
                      <th className="p-2.5 w-28">Preț (RON)</th>
                      <th className="p-2.5 w-10 no-print"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {materials.map((mat, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="p-2">
                          <input
                            type="text"
                            value={mat.name}
                            onChange={(e) => handleMaterialChange(idx, 'name', e.target.value)}
                            placeholder="ex: Filtru antibacterian / Freon R32"
                            className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:border-blue-600"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={mat.quantity}
                            onChange={(e) => handleMaterialChange(idx, 'quantity', e.target.value)}
                            placeholder="1 buc"
                            className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={mat.unitPrice || 0}
                            onChange={(e) => handleMaterialChange(idx, 'unitPrice', Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:outline-none text-right font-mono"
                          />
                        </td>
                        <td className="p-2 text-center no-print">
                          {materials.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMaterial(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  4. Recomandări Tehnice pentru Client
                </label>
                <textarea
                  rows={2}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                  placeholder="ex: Recomandare revizie la 6 luni, evitarea setării sub 22°C..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  5. Observații Finale & Recepție
                </label>
                <textarea
                  rows={2}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                  placeholder="ex: Proba de răcire/încălzire funcțională, fără vibrații..."
                />
              </div>
            </div>

            {/* Cost Summary Box */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Manoperă service:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      value={laborCost}
                      onChange={(e) => setLaborCost(Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-slate-800 text-white font-mono font-bold rounded text-xs border border-slate-700"
                    />
                    <span className="text-slate-400">RON</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block">Materiale & Piese:</span>
                  <span className="font-mono font-bold text-slate-200 text-sm mt-1 block">
                    {formatCurrency(partsTotal)}
                  </span>
                </div>
              </div>

              <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-700 pt-2 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                <span className="text-xs text-slate-400 block uppercase tracking-wider">
                  Total De Plată Intervenție
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </div>

            {/* Signatures Block for Print */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-8">
                <p className="font-bold text-slate-700">
                  Semnătură Tehnician HVAC:
                </p>
                <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto pb-1 text-slate-800 font-semibold font-mono">
                  {technicianSignatureName}
                </div>
              </div>

              <div className="space-y-8">
                <p className="font-bold text-slate-700">
                  Semnătură Beneficiar (Client):
                </p>
                <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto pb-1 text-slate-400 italic">
                  Recepționat conformitate
                </div>
              </div>
            </div>

            {/* Action Bar at bottom - No print */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between no-print">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Închide
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Printează Fișa</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvează & Finalizează Raportul</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
