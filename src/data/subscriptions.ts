// Data contoh (mock) untuk modul Subscriptions. Semua nilai adalah bahan
// pengembangan UI, bukan data riil dari backend, dan tanggal dibuat relatif
// terhadap hari ini agar demo selalu terlihat masuk akal.

export type SubscriptionStatus = 'active' | 'inactive';

export type SubscriptionPlan = {
  id: string;
  name: string;
  code: string;
  price: number;
  durationMonths: number;
  features: string[];
  status: SubscriptionStatus;
};

export type ActiveSubscriptionStatus = 'active' | 'expiring' | 'expired';

export type ActiveSubscription = {
  id: string;
  schoolName: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: ActiveSubscriptionStatus;
};

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';

export type SubscriptionInvoice = {
  id: string;
  invoiceNumber: string;
  schoolName: string;
  planName: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
};

const offsetDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1',
    name: 'Paket Dasar',
    code: 'BASIC',
    price: 500000,
    durationMonths: 1,
    features: ['Guru 20', 'Siswa 200', 'Laporan bulanan'],
    status: 'active',
  },
  {
    id: 'plan-2',
    name: 'Paket Standar',
    code: 'STD',
    price: 1250000,
    durationMonths: 3,
    features: ['Guru 50', 'Siswa 500', 'Laporan bulanan', 'Dukungan prioritas'],
    status: 'active',
  },
  {
    id: 'plan-3',
    name: 'Paket Premium',
    code: 'PRM',
    price: 2400000,
    durationMonths: 6,
    features: ['Guru tanpa batas', 'Siswa tanpa batas', 'Laporan realtime', 'Dukungan khusus'],
    status: 'active',
  },
  {
    id: 'plan-4',
    name: 'Paket Korporat',
    code: 'CRP',
    price: 4500000,
    durationMonths: 12,
    features: ['Semua fitur premium', 'Sekolah multi cabang', 'PIC khusus'],
    status: 'inactive',
  },
];

export const mockActiveSubscriptions: ActiveSubscription[] = [
  {
    id: 'sub-1',
    schoolName: 'Springfield High School',
    planName: 'Paket Standar',
    startDate: offsetDate(-120),
    endDate: offsetDate(60),
    status: 'active',
  },
  {
    id: 'sub-2',
    schoolName: 'Riverdale Community College',
    planName: 'Paket Premium',
    startDate: offsetDate(-200),
    endDate: offsetDate(160),
    status: 'active',
  },
  {
    id: 'sub-3',
    schoolName: 'Semarang International School',
    planName: 'Paket Dasar',
    startDate: offsetDate(-20),
    endDate: offsetDate(10),
    status: 'expiring',
  },
  {
    id: 'sub-4',
    schoolName: 'Bandung Startup Academy',
    planName: 'Paket Premium',
    startDate: offsetDate(-90),
    endDate: offsetDate(270),
    status: 'active',
  },
  {
    id: 'sub-5',
    schoolName: 'Surabaya Creative High School',
    planName: 'Paket Standar',
    startDate: offsetDate(-200),
    endDate: offsetDate(-40),
    status: 'expired',
  },
  {
    id: 'sub-6',
    schoolName: 'SMK Teknologi Nusantara',
    planName: 'Paket Dasar',
    startDate: offsetDate(-180),
    endDate: offsetDate(-90),
    status: 'expired',
  },
];

export const mockInvoices: SubscriptionInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0001',
    schoolName: 'Springfield High School',
    planName: 'Paket Standar',
    amount: 1250000,
    issuedAt: offsetDate(-140),
    dueAt: offsetDate(-110),
    status: 'paid',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-0002',
    schoolName: 'Riverdale Community College',
    planName: 'Paket Premium',
    amount: 2400000,
    issuedAt: offsetDate(-30),
    dueAt: offsetDate(0),
    status: 'unpaid',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-0003',
    schoolName: 'Semarang International School',
    planName: 'Paket Dasar',
    amount: 500000,
    issuedAt: offsetDate(-25),
    dueAt: offsetDate(-3),
    status: 'overdue',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-0004',
    schoolName: 'Bandung Startup Academy',
    planName: 'Paket Premium',
    amount: 2400000,
    issuedAt: offsetDate(-10),
    dueAt: offsetDate(20),
    status: 'paid',
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV-2026-0005',
    schoolName: 'Surabaya Creative High School',
    planName: 'Paket Standar',
    amount: 1250000,
    issuedAt: offsetDate(5),
    dueAt: offsetDate(35),
    status: 'unpaid',
  },
];

export const mockSchoolOptions = [
  'Springfield High School',
  'Riverdale Community College',
  'Semarang International School',
  'Bandung Startup Academy',
  'Surabaya Creative High School',
  'SMK Teknologi Nusantara',
];