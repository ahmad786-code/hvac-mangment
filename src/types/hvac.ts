export type AppointmentStatus = 'programata' | 'in_desfasurare' | 'finalizata' | 'reprogramata';

export type PriorityLevel = 'normal' | 'urgent';

export type EquipmentType = 
  | 'Aer Condiționat Split'
  | 'Aer Condiționat Multi-Split'
  | 'Centrală Termică pe Gaz'
  | 'Sistem VRV / VRF Comercial'
  | 'Pompă de Căldură'
  | 'Ventiloconvector / Chiller';

export interface ServiceNote {
  id: string;
  author: string;
  text: string;
  timestamp: string; // ISO or formatted
}

export interface ServiceReportData {
  diagnosis: string; // Diagnosticare și constatări
  workPerformed: string; // Lucrări efectuate
  materialsUsed: Array<{
    name: string;
    quantity: string;
    unitPrice?: number;
  }>;
  recommendations: string; // Recomandări pentru client
  completionNotes: string; // Observații finale
  laborCost: number; // Cost manoperă în RON
  partsCost: number; // Cost piese în RON
  completedAt?: string;
  technicianSignatureName?: string;
}

export interface PhotoItem {
  id: string;
  type: 'before' | 'after' | 'diagnostic';
  url: string;
  caption: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  address: string;
  sector: string; // e.g. "Sector 1", "Sector 3"
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h format)
  estimatedDuration: string; // e.g. "1.5 ore", "2 ore"
  problemDescription: string;
  equipmentType: EquipmentType;
  assignedTeamId: 'echipa-1' | 'echipa-2' | 'neasignat';
  assignedTechnicianName?: string;
  priority: PriorityLevel;
  status: AppointmentStatus;
  additionalNotes?: string;
  notes: ServiceNote[];
  photos: PhotoItem[];
  serviceReport?: ServiceReportData;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  role: 'Tehnician Principal' | 'Tehnician HVAC' | 'Ajutor Tehnician';
  specialization: string;
}

export interface Team {
  id: 'echipa-1' | 'echipa-2';
  name: string;
  color: string;
  vehicle: string;
  coverageArea: string;
  technicians: Technician[];
}
