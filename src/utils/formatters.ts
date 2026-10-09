import { AppointmentStatus, PriorityLevel } from '../types/hvac';

export const formatRomanianDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return new Intl.DateTimeFormat('ro-RO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const formatLongRomanianDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return new Intl.DateTimeFormat('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const getDayLabel = (dateStr: string): string => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr) return 'Azi';
  if (dateStr === tomorrowStr) return 'Mâine';
  if (dateStr === yesterdayStr) return 'Ieri';
  return formatRomanianDate(dateStr);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case 'programata':
      return {
        label: 'Programată',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        icon: 'calendar',
      };
    case 'in_desfasurare':
      return {
        label: 'În desfășurare',
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-600 animate-pulse',
        icon: 'wrench',
      };
    case 'finalizata':
      return {
        label: 'Finalizată',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        icon: 'check',
      };
    case 'reprogramata':
      return {
        label: 'Reprogramată',
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        dot: 'bg-purple-500',
        icon: 'clock',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-100 text-slate-800 border-slate-200',
        dot: 'bg-slate-500',
        icon: 'help',
      };
  }
};

export const getPriorityBadge = (priority: PriorityLevel) => {
  if (priority === 'urgent') {
    return {
      label: 'Urgentă',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    };
  }
  return {
    label: 'Normală',
    badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
  };
};

export const getTeamName = (teamId: 'echipa-1' | 'echipa-2' | 'neasignat'): string => {
  if (teamId === 'echipa-1') return 'Echipa 1';
  if (teamId === 'echipa-2') return 'Echipa 2';
  return 'Neasignată';
};
