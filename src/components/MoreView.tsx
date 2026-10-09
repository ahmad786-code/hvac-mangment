import React from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  Database, 
  Smartphone, 
  Wrench, 
  ShieldAlert, 
  Info, 
  FileDown, 
  Check, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { Appointment } from '../types/hvac';

interface MoreViewProps {
  onResetDemo: () => void;
  onOpenDemoGuide: () => void;
  onNewAppointment: () => void;
  appointments: Appointment[];
}

export const MoreView: React.FC<MoreViewProps> = ({
  onResetDemo,
  onOpenDemoGuide,
  onNewAppointment,
  appointments,
}) => {
  const [copiedExport, setCopiedExport] = React.useState(false);

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(appointments, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'serviceflow-hvac-date-demo.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Setări & Opțiuni Demonstrație
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Ghid de utilizare, persistență locală și controlul scenariilor demonstrative
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Notă Tehnică & Arhitectură Demo</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          Stocarea locală în browser (localStorage) este exclusiv pentru demonstrație și nu sincronizează datele între dispozitive diferite.
        </p>
        <p className="text-xs text-amber-800">
          Într-o implementare de producție pentru o companie HVAC, aplicația se conectează la o bază de date în timp real pe cloud cu notificări push automate către telefoanele tehnicienilor.
        </p>
      </div>

      {/* Sales Demo Guide Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
            Recomandat pentru prezentare
          </span>
          <span className="text-xs text-slate-400">Durată: 3–5 minute</span>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-white">
            Ghid Interactiv de Prezentare Vânzări
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Un parcurs structurat în 7 pași pentru a arăta proprietarului afacerii trecerea de la programări pe hârtie la o gestiune digitală completă a echipelor.
          </p>
        </div>

        <button
          onClick={onOpenDemoGuide}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Deschide Ghidul de Prezentare</span>
        </button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Reset Demo Data Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Reîncărcare Date Inițiale</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Reinițializează cele 8 programări din București și cele 2 echipe la starea de pornire a demo-ului.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Confirmați resetarea tuturor datelor la starea inițială de test? Toate modificările curente vor fi înlocuite.')) {
                onResetDemo();
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Resetează datele demo
          </button>
        </div>

        {/* Export / Backup JSON */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Export Date Curente (JSON)</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Descărcați fișierul JSON cu intervențiile modificate pentru verificare sau arhivare.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedExport ? <Check className="w-4 h-4 text-emerald-600" /> : <FileDown className="w-4 h-4" />}
            <span>{copiedExport ? 'Fișier Descărcat!' : 'Exportă programările'}</span>
          </button>
        </div>
      </div>

      {/* Mobile-first Experience Info Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Optimizat pentru Utilizare Mobilă</h4>
            <p className="text-xs text-slate-500">
              Conceput pentru tehnicieni pe teren și proprietari mereu în mișcare
            </p>
          </div>
        </div>

        <ul className="text-xs text-slate-600 space-y-2 pt-1 border-t border-slate-100">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Butoane mari de acțiune adaptate pentru utilizare cu mănuși sau la volan.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Integrare directă cu apelatorul telefonului prin <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">tel:</code>.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Lansare automată a navigației GPS prin Google Maps cu adresa pre-completată.
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Tipărire automată raport service în format A4 direct din browser.
          </li>
        </ul>
      </div>

      {/* App Info Footer */}
      <div className="text-center pt-4 text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-600">ServiceFlow HVAC • Versiune Demo 1.0.0</p>
        <p>București & Ilfov • Programări și intervenții într-un singur loc</p>
      </div>
    </div>
  );
};
