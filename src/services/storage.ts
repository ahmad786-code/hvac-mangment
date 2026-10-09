import { Appointment, Team, ServiceNote, ServiceReportData, PhotoItem } from '../types/hvac';
import { INITIAL_APPOINTMENTS, INITIAL_TEAMS } from '../data/mockData';

const APPOINTMENTS_STORAGE_KEY = 'serviceflow_hvac_appointments_v1';
const TEAMS_STORAGE_KEY = 'serviceflow_hvac_teams_v1';

export class StorageService {
  static getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (!data) {
        this.saveAppointments(INITIAL_APPOINTMENTS);
        return INITIAL_APPOINTMENTS;
      }
      return JSON.parse(data) as Appointment[];
    } catch (e) {
      console.error('Failed to load appointments from localStorage:', e);
      return INITIAL_APPOINTMENTS;
    }
  }

  static saveAppointments(appointments: Appointment[]): void {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
      window.dispatchEvent(new CustomEvent('serviceflow:appointments-updated'));
    } catch (e) {
      console.error('Failed to save appointments to localStorage:', e);
    }
  }

  static getTeams(): Team[] {
    try {
      const data = localStorage.getItem(TEAMS_STORAGE_KEY);
      if (!data) {
        this.saveTeams(INITIAL_TEAMS);
        return INITIAL_TEAMS;
      }
      return JSON.parse(data) as Team[];
    } catch (e) {
      console.error('Failed to load teams from localStorage:', e);
      return INITIAL_TEAMS;
    }
  }

  static saveTeams(teams: Team[]): void {
    try {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
      window.dispatchEvent(new CustomEvent('serviceflow:teams-updated'));
    } catch (e) {
      console.error('Failed to save teams to localStorage:', e);
    }
  }

  static getAppointmentById(id: string): Appointment | undefined {
    const list = this.getAppointments();
    return list.find((a) => a.id === id);
  }

  static createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'photos'>): Appointment {
    const list = this.getAppointments();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newAppointment: Appointment = {
      ...data,
      id: `apt-${Date.now().toString(36)}`,
      notes: [
        {
          id: `note-${Date.now()}`,
          author: 'Dispecerat (Creat)',
          text: 'Programare înregistrată în sistem.',
          timestamp: timeStr,
        },
      ],
      photos: [],
      createdAt: `${dateStr} ${timeStr}`,
      updatedAt: `${dateStr} ${timeStr}`,
    };

    const updated = [newAppointment, ...list];
    this.saveAppointments(updated);
    return newAppointment;
  }

  static updateAppointment(id: string, partial: Partial<Appointment>): Appointment | undefined {
    const list = this.getAppointments();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const updatedItem: Appointment = {
      ...list[index],
      ...partial,
      updatedAt: `${dateStr} ${timeStr}`,
    };

    list[index] = updatedItem;
    this.saveAppointments(list);
    return updatedItem;
  }

  static deleteAppointment(id: string): boolean {
    const list = this.getAppointments();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length !== list.length) {
      this.saveAppointments(filtered);
      return true;
    }
    return false;
  }

  static addNote(appointmentId: string, noteText: string, authorName: string = 'Tehnician'): Appointment | undefined {
    const apt = this.getAppointmentById(appointmentId);
    if (!apt) return undefined;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newNote: ServiceNote = {
      id: `note-${Date.now()}`,
      author: authorName,
      text: noteText,
      timestamp: timeStr,
    };

    const notes = [...(apt.notes || []), newNote];
    return this.updateAppointment(appointmentId, { notes });
  }

  static addPhoto(appointmentId: string, photo: Omit<PhotoItem, 'id' | 'timestamp'>): Appointment | undefined {
    const apt = this.getAppointmentById(appointmentId);
    if (!apt) return undefined;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPhotoItem: PhotoItem = {
      ...photo,
      id: `photo-${Date.now()}`,
      timestamp: timeStr,
    };

    const photos = [...(apt.photos || []), newPhotoItem];
    return this.updateAppointment(appointmentId, { photos });
  }

  static saveServiceReport(appointmentId: string, report: ServiceReportData): Appointment | undefined {
    const apt = this.getAppointmentById(appointmentId);
    if (!apt) return undefined;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const reportWithTimestamp: ServiceReportData = {
      ...report,
      completedAt: `${dateStr} ${timeStr}`,
    };

    return this.updateAppointment(appointmentId, {
      status: 'finalizata',
      serviceReport: reportWithTimestamp,
    });
  }

  static resetToDemoData(): void {
    this.saveAppointments(INITIAL_APPOINTMENTS);
    this.saveTeams(INITIAL_TEAMS);
  }
}
