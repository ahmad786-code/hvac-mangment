/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { StorageService } from './services/storage';
import { 
  Appointment, 
  AppointmentStatus, 
  PhotoItem, 
  ServiceReportData, 
  Team 
} from './types/hvac';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardToday } from './components/DashboardToday';
import { InterventionsList } from './components/InterventionsList';
import { TeamsView } from './components/TeamsView';
import { MoreView } from './components/MoreView';
import { InterventionDetailModal } from './components/InterventionDetailModal';
import { AppointmentFormModal } from './components/AppointmentFormModal';
import { ServiceReportModal } from './components/ServiceReportModal';
import { SalesDemoGuideModal } from './components/SalesDemoGuideModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<NavTab>('azi');

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportingAppointment, setReportingAppointment] = useState<Appointment | null>(null);
  const [isSalesGuideOpen, setIsSalesGuideOpen] = useState(false);

  // Toast notifications in Romanian
  const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Initial load
  useEffect(() => {
    const loadedAppointments = StorageService.getAppointments();
    const loadedTeams = StorageService.getTeams();
    setAppointments(loadedAppointments);
    setTeams(loadedTeams);

    // Listen for storage events
    const handleAppointmentsUpdated = () => {
      setAppointments(StorageService.getAppointments());
    };
    const handleTeamsUpdated = () => {
      setTeams(StorageService.getTeams());
    };

    window.addEventListener('serviceflow:appointments-updated', handleAppointmentsUpdated);
    window.addEventListener('serviceflow:teams-updated', handleTeamsUpdated);

    return () => {
      window.removeEventListener('serviceflow:appointments-updated', handleAppointmentsUpdated);
      window.removeEventListener('serviceflow:teams-updated', handleTeamsUpdated);
    };
  }, []);

  // Today's date calculations
  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);

  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.date === todayStr);
  }, [appointments, todayStr]);

  const inProgressToday = useMemo(() => {
    return todayAppointments.filter((a) => a.status === 'in_desfasurare').length;
  }, [todayAppointments]);

  // Keep selected appointment updated if appointments state changes
  useEffect(() => {
    if (selectedAppointment) {
      const refreshed = appointments.find((a) => a.id === selectedAppointment.id);
      if (refreshed) {
        setSelectedAppointment(refreshed);
      }
    }
  }, [appointments, selectedAppointment?.id]);

  // Actions
  const handleOpenNewAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleSaveAppointment = (formData: any) => {
    if (editingAppointment) {
      StorageService.updateAppointment(editingAppointment.id, formData);
      showToast(`Programarea pentru ${formData.clientName} a fost actualizată.`);
    } else {
      const newApt = StorageService.createAppointment(formData);
      showToast(`Programare adăugată cu succes pentru ${newApt.clientName}!`);
    }
    setAppointments(StorageService.getAppointments());
  };

  const handleDeleteAppointment = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    StorageService.deleteAppointment(id);
    setAppointments(StorageService.getAppointments());
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(null);
    }
    showToast(`Programarea pentru ${apt?.clientName || 'client'} a fost ștearsă.`, 'info');
  };

  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
    const statusLabels: Record<AppointmentStatus, string> = {
      programata: 'Programată',
      in_desfasurare: 'În desfășurare (echipa a sosit la locație)',
      finalizata: 'Finalizată cu succes',
      reprogramata: 'Reprogramată',
    };

    StorageService.updateAppointment(id, { status: newStatus });
    StorageService.addNote(
      id,
      `Status actualizat în: ${statusLabels[newStatus]}`,
      'Sistem / Teren'
    );
    setAppointments(StorageService.getAppointments());
    showToast(`Status actualizat: ${statusLabels[newStatus]}`);
  };

  const handleAddNote = (id: string, text: string, author: string) => {
    StorageService.addNote(id, text, author);
    setAppointments(StorageService.getAppointments());
    showToast('Notiță adăugată în jurnalul intervenției.');
  };

  const handleAddPhoto = (id: string, photo: Omit<PhotoItem, 'id' | 'timestamp'>) => {
    StorageService.addPhoto(id, photo);
    setAppointments(StorageService.getAppointments());
    showToast('Fotografia a fost atașată cu succes.');
  };

  const handleReassignTeam = (id: string, teamId: 'echipa-1' | 'echipa-2' | 'neasignat') => {
    const techName = teamId === 'echipa-1' ? 'Andrei Popescu' : teamId === 'echipa-2' ? 'Radu Marinescu' : undefined;
    StorageService.updateAppointment(id, { 
      assignedTeamId: teamId, 
      assignedTechnicianName: techName 
    });
    const teamNameLabel = teamId === 'echipa-1' ? 'Echipa 1' : teamId === 'echipa-2' ? 'Echipa 2' : 'Neasignată';
    StorageService.addNote(id, `Intervenția a fost reasignată către: ${teamNameLabel}`, 'Dispecerat');
    setAppointments(StorageService.getAppointments());
    showToast(`Intervenția a fost alocată către ${teamNameLabel}.`);
  };

  const handleReschedule = (id: string, newDate: string, newTime: string) => {
    StorageService.updateAppointment(id, {
      date: newDate,
      startTime: newTime,
      status: 'reprogramata',
    });
    StorageService.addNote(
      id,
      `Reprogramat pentru data de ${newDate}, ora ${newTime}.`,
      'Dispecerat'
    );
    setAppointments(StorageService.getAppointments());
    showToast(`Programarea a fost mutată pe ${newDate} la ora ${newTime}.`, 'info');
  };

  const handleOpenReport = (appointment: Appointment) => {
    setReportingAppointment(appointment);
    setIsReportOpen(true);
  };

  const handleSaveReport = (id: string, reportData: ServiceReportData) => {
    StorageService.saveServiceReport(id, reportData);
    StorageService.addNote(
      id,
      `Raport de service finalizat. Valoare totală: ${reportData.laborCost + reportData.partsCost} RON.`,
      reportData.technicianSignatureName || 'Tehnician'
    );
    setAppointments(StorageService.getAppointments());
    showToast('Raportul de service a fost salvat și lucrarea a fost marcată ca finalizată!');
  };

  const handleResetDemo = () => {
    StorageService.resetToDemoData();
    setAppointments(StorageService.getAppointments());
    setTeams(StorageService.getTeams());
    setSelectedAppointment(null);
    showToast('Datele demonstrative au fost resetate la starea inițială.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header
        onNewAppointment={handleOpenNewAppointment}
        onResetDemo={handleResetDemo}
        onOpenDemoGuide={() => setIsSalesGuideOpen(true)}
      />

      {/* Navigation (Desktop Top Bar & Mobile Floating button + Bottom Bar) */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onNewAppointment={handleOpenNewAppointment}
        todayCount={todayAppointments.length}
        inProgressCount={inProgressToday}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'azi' && (
          <DashboardToday
            todayAppointments={todayAppointments}
            teams={teams}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
            onNewAppointment={handleOpenNewAppointment}
            onUpdateStatus={handleUpdateStatus}
            onOpenReport={handleOpenReport}
            onResetDemo={handleResetDemo}
          />
        )}

        {activeTab === 'interventii' && (
          <InterventionsList
            appointments={appointments}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
            onNewAppointment={handleOpenNewAppointment}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'echipe' && (
          <TeamsView
            teams={teams}
            appointments={appointments}
            onSelectAppointment={(apt) => setSelectedAppointment(apt)}
            onReassignAppointment={handleReassignTeam}
          />
        )}

        {activeTab === 'mai_multe' && (
          <MoreView
            onResetDemo={handleResetDemo}
            onOpenDemoGuide={() => setIsSalesGuideOpen(true)}
            onNewAppointment={handleOpenNewAppointment}
            appointments={appointments}
          />
        )}
      </main>

      {/* Toast Notification Popup */}
      {toast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs sm:text-sm font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal / Drawer */}
      <InterventionDetailModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onAddPhoto={handleAddPhoto}
        onReassignTeam={handleReassignTeam}
        onReschedule={handleReschedule}
        onOpenReport={handleOpenReport}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
        teams={teams}
      />

      {/* Create / Edit Appointment Form Modal */}
      <AppointmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAppointment}
        editingAppointment={editingAppointment}
        teams={teams}
      />

      {/* Service Report & Technical Acceptance Modal */}
      <ServiceReportModal
        appointment={reportingAppointment}
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setReportingAppointment(null);
        }}
        onSaveReport={handleSaveReport}
        teams={teams}
      />

      {/* 3-5 Minute Sales Presentation Walkthrough Modal */}
      <SalesDemoGuideModal
        isOpen={isSalesGuideOpen}
        onClose={() => setIsSalesGuideOpen(false)}
        onGoToTab={(tab) => setActiveTab(tab)}
        onTriggerNewAppointment={handleOpenNewAppointment}
        onResetDemo={handleResetDemo}
      />
    </div>
  );
}
