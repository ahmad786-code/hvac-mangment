import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Calendar, 
  Users, 
  Play, 
  FileText, 
  RotateCcw,
  Clock,
  Layers
} from 'lucide-react';

interface SalesDemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToTab: (tab: 'azi' | 'interventii' | 'echipe' | 'mai_multe') => void;
  onTriggerNewAppointment: () => void;
  onResetDemo: () => void;
}

const DEMO_STEPS = [
  {
    step: 1,
    title: '1. Deschiderea panoului de bord ("Azi")',
    subtitle: 'Proprietarul vede dintr-o privire tot programul zilei',
    actionLabel: 'Mergi la Panoul "Azi"',
    actionType: 'tab-azi',
    description:
      'Arătați clientului contorizarea clară: câte intervenții sunt programate, câte sunt în derulare și câte sunt finalizate. Fără agende pe hârtie sau foi pierdute.',
    talkTrack:
      '„În fiecare dimineață, deschideți telefonul și vedeți exact ce au de făcut cele 2 echipe pe sectoarele din București, fără să mai căutați prin caiet.”',
  },
  {
    step: 2,
    title: '2. Preluarea unui nou apel telefonic',
    subtitle: 'Înregistrare rapidă în mai puțin de 30 de secunde',
    actionLabel: 'Simulează Apel Nou (+ Programare)',
    actionType: 'new-apt',
    description:
      'Un client sună pentru că aparatul de aer condiționat nu mai răcește sau curge apă. Dispecerul sau proprietarul apasă "+ Programare nouă" și completează adresa și sectorul.',
    talkTrack:
      '„Când vă sună un client pe drum, deschideți aplicația, introduceți adresa și problema, iar programarea intră direct în sistem.”',
  },
  {
    step: 3,
    title: '3. Alocarea inteligentă către Echipa 1 sau 2',
    subtitle: 'Distribuirea lucrării pe baza zonei și a încărcării',
    actionLabel: 'Vezi Încărcarea Echipelor',
    actionType: 'tab-echipe',
    description:
      'Puteți alege Echipa 1 (Sector 1, 2, 6) sau Echipa 2 (Sector 3, 4, 5). Lucrarea apare instantaneu pe telefonul tehnicienilor.',
    talkTrack:
      '„Știți imediat care echipă este mai aproape sau mai liberă și trimiteți lucrarea direct fără telefoane suplimentare.”',
  },
  {
    step: 4,
    title: '4. Vizualizarea din perspectiva tehnicianului pe teren',
    subtitle: 'Acces la adresă, navigare Google Maps și apelare directă',
    actionLabel: 'Vezi Lista Intervențiilor',
    actionType: 'tab-interventii',
    description:
      'Tehnicianul de pe mașină deschide intervenția, apasă un singur buton pentru a porni navigația GPS sau pentru a suna clientul dacă nu găsește blocul.',
    talkTrack:
      '„Băieții din teren au adresa exactă, numărul de telefon cu apelare directă și instrucțiunile de acces chiar pe ecran.”',
  },
  {
    step: 5,
    title: '5. Pornirea intervenției ("În desfășurare")',
    subtitle: 'Transparență totală în timp real',
    actionLabel: 'Mergi la Panou și Pornește',
    actionType: 'tab-azi',
    description:
      'Când tehnicianul ajunge la locație, apasă "Pornește intervenția". Statusul se schimbă în albastru pe ecranul proprietarului.',
    talkTrack:
      '„Dumneavoastră vedeți de la birou exact când s-a început lucrarea și că echipa este la adresă.”',
  },
  {
    step: 6,
    title: '6. Finalizarea lucrării & Raport de service',
    subtitle: 'Constatări, piese consumate și fotografii înainte/după',
    actionLabel: 'Simulează Raport Service',
    actionType: 'tab-azi',
    description:
      'Tehnicianul bifează piesele folosite (freon, filtre, spray igienizant), face poze la echipament și marchează intervenția finalizată.',
    talkTrack:
      '„La plecare se generează fișa de intervenție cu manoperă și materiale, care poate fi imprimată sau salvată imediat.”',
  },
  {
    step: 7,
    title: '7. Actualizarea automată a dispeceratului',
    subtitle: 'Totul sincronizat fără efort',
    actionLabel: 'Verifică Panoul Final',
    actionType: 'tab-azi',
    description:
      'Contoarele se actualizează automat: lucrarea este marcată cu verde ("Finalizată"), iar echipa este gata pentru următoarea adresă.',
    talkTrack:
      '„La finalul zilei știți exact ce s-a încasat, ce s-a montat și că niciun client nu a rămas nerezolvat.”',
  },
];

export const SalesDemoGuideModal: React.FC<SalesDemoGuideModalProps> = ({
  isOpen,
  onClose,
  onGoToTab,
  onTriggerNewAppointment,
  onResetDemo,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];

  const handleStepAction = () => {
    if (currentStep.actionType === 'tab-azi') {
      onGoToTab('azi');
    } else if (currentStep.actionType === 'tab-interventii') {
      onGoToTab('interventii');
    } else if (currentStep.actionType === 'tab-echipe') {
      onGoToTab('echipe');
    } else if (currentStep.actionType === 'new-apt') {
      onTriggerNewAppointment();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Ghid de Prezentare Vânzări (3–5 Minute)
              </h3>
              <p className="text-xs text-slate-300">
                Scenariu structurat pentru convingerea unui proprietar de firmă HVAC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[340px] px-2">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentStepIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{s.step}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <span>Pasul {currentStep.step} din {DEMO_STEPS.length}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {currentStep.title}
            </h4>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Description Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {currentStep.description}
          </div>

          {/* Suggested Pitch Script Box */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Ce să îi spuneți clientului (Discurs recomandat):
            </span>
            <p className="text-xs sm:text-sm font-medium text-blue-950 italic">
              {currentStep.talkTrack}
            </p>
          </div>

          {/* Direct Action Button to Trigger Current Step in the App */}
          <div className="pt-2">
            <button
              onClick={handleStepAction}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Footer with navigation between steps */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((i) => i - 1)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 disabled:opacity-40 cursor-pointer"
            >
              &larr; Înapoi
            </button>
            <button
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              onClick={() => setCurrentStepIndex((i) => i + 1)}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Următorul pas &rarr;
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Doriți să resetați toate datele la starea inițială demonstrativă?')) {
                onResetDemo();
                setCurrentStepIndex(0);
              }
            }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Resetează date demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
