import { Appointment, Team } from '../types/hvac';

// Helper to get formatted date string YYYY-MM-DD
export const getRelativeDate = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'echipa-1',
    name: 'Echipa 1',
    color: 'blue',
    vehicle: 'Dacia Dokker (B-101-HVC)',
    coverageArea: 'Sector 1, Sector 2, Sector 6 & Ilfov Nord',
    technicians: [
      {
        id: 'tech-1',
        name: 'Andrei Popescu',
        phone: '+40 722 101 201',
        role: 'Tehnician Principal',
        specialization: 'Sisteme VRV/VRF, Climatizare rezidențială & industrială',
      },
      {
        id: 'tech-2',
        name: 'Mihai Ionescu',
        phone: '+40 722 101 202',
        role: 'Tehnician HVAC',
        specialization: 'Centrale termice, Diagnosticare electrică & fluide refrigerante',
      },
    ],
  },
  {
    id: 'echipa-2',
    name: 'Echipa 2',
    color: 'emerald',
    vehicle: 'Renault Kangoo (B-202-HVC)',
    coverageArea: 'Sector 3, Sector 4, Sector 5 & Ilfov Sud',
    technicians: [
      {
        id: 'tech-3',
        name: 'Radu Marinescu',
        phone: '+40 723 303 401',
        role: 'Tehnician Principal',
        specialization: 'Pompe de căldură, Mentenanță preventivă & igienizări profesionale',
      },
      {
        id: 'tech-4',
        name: 'Vlad Dumitrescu',
        phone: '+40 723 303 402',
        role: 'Tehnician HVAC',
        specialization: 'Instalații split & multisplit, Teste presiune azot',
      },
    ],
  },
];

// HVAC illustrative photos (curated reliable Unsplash HVAC & technical images)
const HVAC_PHOTOS = {
  acUnitOutdoor: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  gauges: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  filtersDirty: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  filtersClean: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
  thermalBoiler: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  technicianWork: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    clientName: 'Alexandru Dumitru',
    clientPhone: '+40 721 345 678',
    clientEmail: 'alexandru.dumitru@example.ro',
    address: 'Str. Căderea Bastiliei 14, Ap. 6',
    sector: 'Sector 1',
    date: getRelativeDate(0), // Azi
    startTime: '09:00',
    estimatedDuration: '1.5 ore',
    problemDescription: 'Unitatea de aer condiționat nu răcește. Suflă aer la temperatura camerei și se aude un fâsâit ușor.',
    equipmentType: 'Aer Condiționat Split',
    assignedTeamId: 'echipa-1',
    assignedTechnicianName: 'Andrei Popescu',
    priority: 'urgent',
    status: 'in_desfasurare',
    additionalNotes: 'Interfon 06. Acces facil la unitatea exterioară pe balcon deschis. Clientul este acasă.',
    notes: [
      {
        id: 'note-1',
        author: 'Dispecerat',
        text: 'Clientul a sunat la ora 08:15. A menționat că aparatul este un Daikin Sensira 12.000 BTU instalat acum 3 ani.',
        timestamp: '08:20',
      },
      {
        id: 'note-2',
        author: 'Andrei Popescu (Tehnician)',
        text: 'Am sosit la locație la 09:05. Măsurat presiune pe joasă: 3.2 bar (scăzută). Se verifică traseul frigorific pentru neetanșeități.',
        timestamp: '09:18',
      },
    ],
    photos: [
      {
        id: 'ph-1',
        type: 'diagnostic',
        url: HVAC_PHOTOS.gauges,
        caption: 'Măsurare presiune baterie manometre (3.2 bar pe joasă)',
        timestamp: '09:12',
      },
      {
        id: 'ph-2',
        type: 'before',
        url: HVAC_PHOTOS.acUnitOutdoor,
        caption: 'Unitate exterioară Daikin înainte de verificare conexiuni olandeze',
        timestamp: '09:15',
      },
    ],
    createdAt: `${getRelativeDate(0)} 08:20`,
    updatedAt: `${getRelativeDate(0)} 09:18`,
  },
  {
    id: 'apt-002',
    clientName: 'Elena Stanciu (Cabinet Dental Pro)',
    clientPhone: '+40 730 456 789',
    clientEmail: 'contact@dentalpro-bucuresti.ro',
    address: 'Bd. Decebal 12, Bl. S2, Sc. 1, Parter',
    sector: 'Sector 3',
    date: getRelativeDate(0), // Azi
    startTime: '08:30',
    estimatedDuration: '2 ore',
    problemDescription: 'Revizie periodică aer condiționat și igienizare chimică antibacteriană conform normelor medicale.',
    equipmentType: 'Aer Condiționat Multi-Split',
    assignedTeamId: 'echipa-2',
    assignedTechnicianName: 'Radu Marinescu',
    priority: 'normal',
    status: 'finalizata',
    additionalNotes: 'Parcare privată în spatele clădirii cu barieră. Ridicare telecomenzi de la recepție.',
    notes: [
      {
        id: 'note-3',
        author: 'Radu Marinescu (Tehnician)',
        text: 'Finalizat igienizarea cu soluție Sanosil și curățat turbinele la ambele unități interne. Debit optim și miros curat.',
        timestamp: '10:20',
      },
    ],
    photos: [
      {
        id: 'ph-3',
        type: 'before',
        url: HVAC_PHOTOS.filtersDirty,
        caption: 'Filtre și evaporator înainte de curățare chimică',
        timestamp: '08:45',
      },
      {
        id: 'ph-4',
        type: 'after',
        url: HVAC_PHOTOS.filtersClean,
        caption: 'Filtre igienizate și dezinfectate complet',
        timestamp: '10:15',
      },
    ],
    serviceReport: {
      diagnosis: 'Depuneri moderate de praf și bacterii pe suprafața evaporatorului și pe tăvița de condens. Fără pierderi de freon (presiune nominală 8.2 bar pe R32).',
      workPerformed: 'Demontare carcase, curățare cu spumă activă specială HVAC, clătire sub presiune cu lance dedicată, igienizare cu abur la 140°C a turbinelor și dezinfectare tăviță condens cu soluție fungicidă.',
      materialsUsed: [
        { name: 'Soluție profesională curățare chimică CleanAir 1L', quantity: '1 buc', unitPrice: 65 },
        { name: 'Spray dezinfectant antibacterian/antifungic avizat MS', quantity: '1 buc', unitPrice: 45 },
        { name: 'Pastile dezinfectante pentru tăvița de condens', quantity: '2 buc', unitPrice: 15 },
      ],
      recommendations: 'Se recomandă repetarea igienizării la 6 luni având în vedere specificul medical al spațiului.',
      completionNotes: 'Clientul a verificat debitul de aer și a semnat fișa de recepție tehnică. Echipamentul funcționează impecabil.',
      laborCost: 350,
      partsCost: 140,
      completedAt: `${getRelativeDate(0)} 10:30`,
      technicianSignatureName: 'Radu Marinescu',
    },
    createdAt: `${getRelativeDate(-1)} 16:40`,
    updatedAt: `${getRelativeDate(0)} 10:30`,
  },
  {
    id: 'apt-003',
    clientName: 'Cristian Moraru',
    clientPhone: '+40 744 112 334',
    clientEmail: 'cristian.moraru@gmail.com',
    address: 'Str. Mihai Eminescu 45, Et. 2, Ap. 8',
    sector: 'Sector 2',
    date: getRelativeDate(0), // Azi
    startTime: '11:30',
    estimatedDuration: '1 oră',
    problemDescription: 'Verificare centrală termică - presiunea scade constant sub 0.8 bar și apare cod eroare E10 pe ecran.',
    equipmentType: 'Centrală Termică pe Gaz',
    assignedTeamId: 'echipa-1',
    assignedTechnicianName: 'Mihai Ionescu',
    priority: 'normal',
    status: 'programata',
    additionalNotes: 'Centrală Viessmann Vitodens 100-W. Clientul are la dispoziție manualul tehnic și garanția.',
    notes: [
      {
        id: 'note-5',
        author: 'Dispecerat',
        text: 'Programat telefonic la 08:45. Echipa 1 preia intervenția după finalizarea cazului de la Căderea Bastiliei.',
        timestamp: '08:50',
      },
    ],
    photos: [
      {
        id: 'ph-5',
        type: 'diagnostic',
        url: HVAC_PHOTOS.thermalBoiler,
        caption: 'Panou centrală Viessmann (eroare presiune semnalată)',
        timestamp: '08:50',
      },
    ],
    createdAt: `${getRelativeDate(0)} 08:50`,
    updatedAt: `${getRelativeDate(0)} 08:50`,
  },
  {
    id: 'apt-004',
    clientName: 'Ioana Vasilescu',
    clientPhone: '+40 765 890 123',
    address: 'Bd. Iuliu Maniu 78, Bl. 14, Sc. B, Ap. 41',
    sector: 'Sector 6',
    date: getRelativeDate(0), // Azi
    startTime: '13:00',
    estimatedDuration: '1.5 ore',
    problemDescription: 'Verificare și remediere pierdere de apă din unitatea internă. Picură pe parchet când aparatul este pornit.',
    equipmentType: 'Aer Condiționat Split',
    assignedTeamId: 'echipa-1',
    assignedTechnicianName: 'Andrei Popescu',
    priority: 'urgent',
    status: 'programata',
    additionalNotes: 'Urgență deoarece parchetul din lemn masiv se poate umfla. Furtunul de condens pare înfundat.',
    notes: [
      {
        id: 'note-6',
        author: 'Dispecerat',
        text: 'Clienta a oprit aparatul și a pus un recipient. Solicitat sosire urgentă în fereastra 13:00.',
        timestamp: '09:00',
      },
    ],
    photos: [],
    createdAt: `${getRelativeDate(0)} 09:00`,
    updatedAt: `${getRelativeDate(0)} 09:00`,
  },
  {
    id: 'apt-005',
    clientName: 'S.C. Avangarde Bistro S.R.L. (George Ilie)',
    clientPhone: '+40 720 998 776',
    clientEmail: 'manager@avangarde-bistro.ro',
    address: 'Bd. Gheorghe Șincai 18, Parter comercial',
    sector: 'Sector 4',
    date: getRelativeDate(0), // Azi
    startTime: '14:30',
    estimatedDuration: '2.5 ore',
    problemDescription: 'Curățare filtre și verificare sistem VRV comercial. Scădere randament răcire în salonul principal de mese.',
    equipmentType: 'Sistem VRV / VRF Comercial',
    assignedTeamId: 'echipa-2',
    assignedTechnicianName: 'Vlad Dumitrescu',
    priority: 'normal',
    status: 'programata',
    additionalNotes: 'Intervenție programată între prânz și cină pentru a nu deranja clienții restaurantului.',
    notes: [],
    photos: [
      {
        id: 'ph-6',
        type: 'diagnostic',
        url: HVAC_PHOTOS.technicianWork,
        caption: 'Unitate exterioară VRF pe acoperiș bistro',
        timestamp: '10:00',
      },
    ],
    createdAt: `${getRelativeDate(-1)} 14:00`,
    updatedAt: `${getRelativeDate(-1)} 14:00`,
  },
  {
    id: 'apt-006',
    clientName: 'Bogdan Enache',
    clientPhone: '+40 733 221 445',
    address: 'Șos. Nordului 62, Complex Rezidențial Herăstrău, Vila 4',
    sector: 'Sector 1',
    date: getRelativeDate(0), // Azi
    startTime: '16:30',
    estimatedDuration: '2 ore',
    problemDescription: 'Diagnosticare echipament HVAC - zgomot puternic vibrație la unitatea exterioară pompă de căldură.',
    equipmentType: 'Pompă de Căldură',
    assignedTeamId: 'echipa-1',
    assignedTechnicianName: 'Andrei Popescu',
    priority: 'normal',
    status: 'reprogramata',
    additionalNotes: 'Reprogramat la cererea clientului pentru mâine dimineață la 08:30 (ședință neprevăzută la birou).',
    notes: [
      {
        id: 'note-7',
        author: 'Dispecerat',
        text: 'Clientul a solicitat reprogramarea la ora 09:30 din cauza unui zbor întârziat.',
        timestamp: '09:30',
      },
    ],
    photos: [],
    createdAt: `${getRelativeDate(-2)} 11:00`,
    updatedAt: `${getRelativeDate(0)} 09:30`,
  },
  {
    id: 'apt-007',
    clientName: 'Mircea Teodorescu',
    clientPhone: '+40 729 881 223',
    address: 'Calea Călărași 180, Bl. 55, Et. 4',
    sector: 'Sector 3',
    date: getRelativeDate(1), // Mâine
    startTime: '10:00',
    estimatedDuration: '1.5 ore',
    problemDescription: 'Revizie periodică aer condiționat și completare freon R410A.',
    equipmentType: 'Aer Condiționat Split',
    assignedTeamId: 'echipa-2',
    assignedTechnicianName: 'Radu Marinescu',
    priority: 'normal',
    status: 'programata',
    additionalNotes: 'Apartament 2 camere, unitate exterioară montată sub geamul sufrageriei.',
    notes: [],
    photos: [],
    createdAt: `${getRelativeDate(0)} 09:15`,
    updatedAt: `${getRelativeDate(0)} 09:15`,
  },
  {
    id: 'apt-008',
    clientName: 'Simona Grigore (Notariat Public)',
    clientPhone: '+40 728 554 112',
    address: 'Str. Teiul Doamnei 22, Parter',
    sector: 'Sector 2',
    date: getRelativeDate(0), // Azi - Neasignată pentru a demonstra procesul de alocare către echipă!
    startTime: '17:00',
    estimatedDuration: '1 oră',
    problemDescription: 'Centrală termică în condensare - oprire bruscă pe furnizare apă caldă. Fără căldură în birouri.',
    equipmentType: 'Centrală Termică pe Gaz',
    assignedTeamId: 'neasignat',
    priority: 'urgent',
    status: 'programata',
    additionalNotes: 'Programare primită telefonic recent. Necesită alocare urgentă la Echipa 1 sau Echipa 2.',
    notes: [
      {
        id: 'note-8',
        author: 'Dispecerat (Telefon)',
        text: 'Primit apel de la secretară. Au clienți programați și nu au apă caldă menajeră. Solicitare urgentă.',
        timestamp: '09:40',
      },
    ],
    photos: [],
    createdAt: `${getRelativeDate(0)} 09:40`,
    updatedAt: `${getRelativeDate(0)} 09:40`,
  },
];
