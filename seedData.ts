import { UserStory, Sprint, Squad, SprintSquad, StoryAssignment, Project } from './types';

// --- PROJECTS ---
export const INITIAL_PROJECTS: Project[] = [
  { id: 'P1', name: 'Jakarta Mobile 4.0', color: 'indigo', description: 'Transformasi digital perbankan inti dan fitur gaya hidup.' },
  { id: 'P2', name: 'Loan & Credit Engine', color: 'emerald', description: 'Sistem otomasi kredit dan integrasi skoring.' }
];

// --- SPRINTS ---
export const INITIAL_SPRINTS: Sprint[] = [
  { id: 'S1', projectId: 'P1', name: 'Sprint 1', startDate: '2024-03-01T00:00:00Z', endDate: '2024-03-14T00:00:00Z', capacityFactor: 0.8 },
  { id: 'S2', projectId: 'P1', name: 'Sprint 2', startDate: '2024-03-15T00:00:00Z', endDate: '2024-03-28T00:00:00Z', capacityFactor: 0.8 },
  { id: 'S3', projectId: 'P1', name: 'Sprint 3', startDate: '2024-03-29T00:00:00Z', endDate: '2024-04-11T00:00:00Z', capacityFactor: 0.8 },
  { id: 'S4', projectId: 'P1', name: 'Sprint 4', startDate: '2024-04-12T00:00:00Z', endDate: '2024-04-25T00:00:00Z', capacityFactor: 0.8 },
  { id: 'S5', projectId: 'P1', name: 'Sprint 5', startDate: '2024-04-26T00:00:00Z', endDate: '2024-05-09T00:00:00Z', capacityFactor: 0.8 },
  { id: 'S6', projectId: 'P1', name: 'Sprint 6', startDate: '2024-05-10T00:00:00Z', endDate: '2024-05-23T00:00:00Z', capacityFactor: 0.8 },
  { id: 'S7', projectId: 'P1', name: 'Sprint 7', startDate: '2024-05-24T00:00:00Z', endDate: '2024-06-06T00:00:00Z', capacityFactor: 0.8 },
  { id: 'S8', projectId: 'P1', name: 'Sprint 8', startDate: '2024-06-07T00:00:00Z', endDate: '2024-06-20T00:00:00Z', capacityFactor: 0.8 },
];

// --- SQUADS ---
export const INITIAL_SQUADS: Squad[] = [
  { id: 'Squad 1', projectId: 'P1', name: 'Alpha - Core Onboarding' },
  { id: 'Squad 2', projectId: 'P1', name: 'Beta - Account Services' },
  { id: 'Squad 3', projectId: 'P1', name: 'Gamma - Cards & Security' },
  { id: 'Squad 4', projectId: 'P1', name: 'Delta - Payments & Transfer' },
];

// --- SPRINT SQUADS (Generated Combinations) ---
export const INITIAL_SPRINT_SQUADS: SprintSquad[] = [];
INITIAL_SPRINTS.forEach(s => {
  INITIAL_SQUADS.forEach(sq => {
    INITIAL_SPRINT_SQUADS.push({
      id: `SS-${s.id}-${sq.id}`,
      sprintId: s.id,
      squadId: sq.id,
      membersByRole: { backend: 2, android: 2, ios: 2, qa: 2, qaAutomation: 1 }
    });
  });
});

// --- USER STORIES (Complete Data) ---
export const INITIAL_STORIES: UserStory[] = [
  // Sprint 1
  { id: '14', projectId: 'P1', title: 'New to Bank (NTB)', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 15, android: 20, ios: 20, qa: 20, qaAutomation: 21.5 }, dependencies: [] },
  { id: '22', projectId: 'P1', title: 'Pre Login', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 2, android: 1, ios: 1, qa: 2, qaAutomation: 1.7 }, dependencies: [] },
  { id: '23', projectId: 'P1', title: 'Post Login', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 6, android: 5, ios: 5, qa: 6, qaAutomation: 6.5 }, dependencies: [] },
  { id: '24', projectId: 'P1', title: 'Account Listing', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 16, android: 10, ios: 10, qa: 16, qaAutomation: 15 }, dependencies: [] },
  { id: '25', projectId: 'P1', title: 'Card Detail Page', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 6, android: 6, ios: 6, qa: 6, qaAutomation: 7.2 }, dependencies: [] },
  { id: '35', projectId: 'P1', title: 'Profile', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 1.5, android: 3, ios: 3, qa: 3, qaAutomation: 2.85 }, dependencies: [] },
  { id: '36', projectId: 'P1', title: 'Language', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 2, android: 3, ios: 3, qa: 3, qaAutomation: 3.1 }, dependencies: [] },
  { id: '37', projectId: 'P1', title: 'Profile Picture', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 3, android: 4, ios: 4, qa: 4, qaAutomation: 4.3 }, dependencies: [] },
  { id: '38', projectId: 'P1', title: 'Edit Email', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 2, android: 2.5, ios: 2.5, qa: 3, qaAutomation: 2.75 }, dependencies: [] },

  // Sprint 2
  { id: '17', projectId: 'P1', title: 'Onboarding - Login', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 3, android: 4, ios: 4, qa: 4, qaAutomation: 4.3 }, dependencies: ['22'] },
  { id: '15', projectId: 'P1', title: 'Aktivasi', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 5, android: 5, ios: 5, qa: 5, qaAutomation: 6 }, dependencies: [] },
  { id: '16', projectId: 'P1', title: 'Ganti Device', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 5, android: 5, ios: 5, qa: 5, qaAutomation: 6 }, dependencies: [] },
  { id: '27', projectId: 'P1', title: 'Detail Transaksi', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 1.5, android: 1, ios: 1, qa: 2, qaAutomation: 1.45 }, dependencies: [] },
  { id: '26', projectId: 'P1', title: 'Changed Featured Cards', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 1.5, android: 1, ios: 1, qa: 2, qaAutomation: 1.45 }, dependencies: [] },
  { id: '41', projectId: 'P1', title: 'Change PIN', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 2, android: 2.5, ios: 2.5, qa: 3, qaAutomation: 2.75 }, dependencies: [] },
  { id: '43', projectId: 'P1', title: 'Forgot PIN', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 3, android: 2.5, ios: 2.5, qa: 3, qaAutomation: 3.25 }, dependencies: [] },
  { id: '44', projectId: 'P1', title: 'Contact Us', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 3, android: 5, ios: 5, qa: 5, qaAutomation: 5 }, dependencies: [] },
  { id: '40', projectId: 'P1', title: 'Biometric', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 2, android: 2.5, ios: 2.5, qa: 3, qaAutomation: 2.75 }, dependencies: [] },
  { id: '42', projectId: 'P1', title: 'Change Password', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 3, android: 4.5, ios: 4.5, qa: 5, qaAutomation: 4.65 }, dependencies: [] },

  // Sprint 3
  { id: '110', projectId: 'P1', title: 'Informasi Tabungan', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 2, android: 6, ios: 6, qa: 6, qaAutomation: 5.2 }, dependencies: [] },
  { id: '111', projectId: 'P1', title: 'Informasi Tabungan Rencana', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 10, android: 17, ios: 17, qa: 17, qaAutomation: 16.9 }, dependencies: [] },
  { id: '113', projectId: 'P1', title: 'Informasi Deposito', epic: 'Produk Jasa', category: 'Existing', mandaysByRole: { backend: 10, android: 13, ios: 13, qa: 13, qaAutomation: 14.1 }, dependencies: [] },
  { id: '114', projectId: 'P1', title: 'Informasi Pinjaman', epic: 'Buka Rekening', category: 'Existing', mandaysByRole: { backend: 8, android: 6, ios: 6, qa: 8, qaAutomation: 8.2 }, dependencies: [] },
  { id: '29', projectId: 'P1', title: 'Blocked Card', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 1, android: 1, ios: 1, qa: 1, qaAutomation: 1.2 }, dependencies: [] },
  { id: '30', projectId: 'P1', title: 'Expired Card', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 0.5, android: 1, ios: 1, qa: 1, qaAutomation: 0.95 }, dependencies: [] },
  { id: '31', projectId: 'P1', title: 'Unhide CVV', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 2.5, android: 3, ios: 3, qa: 3, qaAutomation: 3.35 }, dependencies: [] },
  { id: '18', projectId: 'P1', title: 'Flow On Us', epic: 'Transfer', category: 'Existing', mandaysByRole: { backend: 7, android: 6, ios: 6, qa: 7, qaAutomation: 7.7 }, dependencies: [] },
  { id: '19', projectId: 'P1', title: 'Flow Off Us', epic: 'Transfer', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '81', projectId: 'P1', title: 'PLN Postpaid', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 6, ios: 6, qa: 6, qaAutomation: 6.2 }, dependencies: [] },
  { id: '82', projectId: 'P1', title: 'PLN Non Taglis', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 2, ios: 2, qa: 4, qaAutomation: 3.4 }, dependencies: [] },
  { id: '85', projectId: 'P1', title: 'TV Kabel (MNC, Transvision, dll)', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '83', projectId: 'P1', title: 'Pascabayar (Tsel, Isat, dll)', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '112', projectId: 'P1', title: 'Pam Jaya', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: '84', projectId: 'P1', title: 'Internet (Indihome, First Media, dll)', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 5, ios: 5, qa: 5, qaAutomation: 5.5 }, dependencies: [] },
  { id: '48', projectId: 'P1', title: 'Listrik (Token PLN)', epic: 'Pembelian', category: 'Existing', mandaysByRole: { backend: 7, android: 7, ios: 7, qa: 7, qaAutomation: 8.4 }, dependencies: [] },
  { id: '55', projectId: 'P1', title: 'Hubungi Kami (Kartu)', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 2, android: 2, ios: 2, qa: 2, qaAutomation: 2.4 }, dependencies: [] },
  { id: '47', projectId: 'P1', title: 'Pulsa', epic: 'Pembelian', category: 'Existing', mandaysByRole: { backend: 3, android: 4, ios: 4, qa: 4, qaAutomation: 4.3 }, dependencies: [] },
  { id: '49', projectId: 'P1', title: 'Paket Data', epic: 'Pembelian', category: 'Existing', mandaysByRole: { backend: 3, android: 4, ios: 4, qa: 4, qaAutomation: 4.3 }, dependencies: [] },
  { id: '60', projectId: 'P1', title: 'Notification List', epic: 'Notification', category: 'Existing', mandaysByRole: { backend: 6, android: 9, ios: 9, qa: 9, qaAutomation: 9.3 }, dependencies: [] },
  { id: '45', projectId: 'P1', title: 'FAQ', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 2, android: 3.5, ios: 3.5, qa: 4, qaAutomation: 3.45 }, dependencies: [] },
  { id: '61', projectId: 'P1', title: 'Delete Notif', epic: 'Notification', category: 'Existing', mandaysByRole: { backend: 0.5, android: 1.5, ios: 1.5, qa: 2, qaAutomation: 1.3 }, dependencies: [] },
  { id: '62', projectId: 'P1', title: 'Delete All Notif', epic: 'Notification', category: 'Existing', mandaysByRole: { backend: 1.5, android: 1, ios: 1, qa: 2, qaAutomation: 1.45 }, dependencies: [] },
  { id: '39', projectId: 'P1', title: 'Notification Setting', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 6, android: 3, ios: 3, qa: 6, qaAutomation: 5.1 }, dependencies: [] },
  { id: '46', projectId: 'P1', title: 'Referral', epic: 'Profile - Akun', category: 'Existing', mandaysByRole: { backend: 1.5, android: 1, ios: 1, qa: 2, qaAutomation: 1.45 }, dependencies: [] },
  { id: '80', projectId: 'P1', title: 'Air / PDAM', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 6, ios: 6, qa: 6, qaAutomation: 6.2 }, dependencies: [] },
  { id: '7', projectId: 'P1', title: 'Zakat & Donasi', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 2, android: 2, ios: 2, qa: 2, qaAutomation: 2.4 }, dependencies: [] },
  { id: '20', projectId: 'P1', title: 'Transfer Internasional', epic: 'Transfer', category: 'Existing', mandaysByRole: { backend: 8, android: 7.5, ios: 7.5, qa: 8, qaAutomation: 9.25 }, dependencies: [] },
  { id: '69', projectId: 'P1', title: 'Tambah Rekening Tabungan', epic: 'Buka Rekening', category: 'Existing', mandaysByRole: { backend: 2, android: 6, ios: 6, qa: 6, qaAutomation: 5.2 }, dependencies: [] },
  { id: '70', projectId: 'P1', title: 'Tabungan Rencana', epic: 'Buka Rekening', category: 'Existing', mandaysByRole: { backend: 10, android: 17, ios: 17, qa: 17, qaAutomation: 16.9 }, dependencies: [] },

  // Sprint 4
  { id: '50', projectId: 'P1', title: 'Block Card', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 2.5, android: 2, ios: 2, qa: 3, qaAutomation: 2.65 }, dependencies: [] },
  { id: '51', projectId: 'P1', title: 'Unblock Card', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 0.5, android: 0.5, ios: 0.5, qa: 1, qaAutomation: 0.6 }, dependencies: [] },
  { id: '28', projectId: 'P1', title: 'E-Statement', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 5, android: 2.5, ios: 2.5, qa: 5, qaAutomation: 4.25 }, dependencies: [] },
  { id: '33', projectId: 'P1', title: 'Top-Up (Quick)', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 4, android: 5, ios: 5, qa: 5, qaAutomation: 5.5 }, dependencies: [] },
  { id: '8', projectId: 'P1', title: 'MPM - Scan QR', epic: 'QRIS', category: 'Existing', mandaysByRole: { backend: 10, android: 8, ios: 8, qa: 10, qaAutomation: 10.6 }, dependencies: [] },
  { id: '56', projectId: 'P1', title: 'Ajukan Kartu Fisik', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 8, android: 13, ios: 13, qa: 13, qaAutomation: 13.1 }, dependencies: [] },
  { id: '9', projectId: 'P1', title: 'MPM - Upload QR', epic: 'QRIS', category: 'Existing', mandaysByRole: { backend: 0.5, android: 2, ios: 2, qa: 2, qaAutomation: 1.65 }, dependencies: [] },
  { id: '1', projectId: 'P1', title: 'BPJS Kesehatan', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 8, android: 8, ios: 8, qa: 8, qaAutomation: 9.6 }, dependencies: [] },
  { id: '10', projectId: 'P1', title: 'CPM - Merchant Scan', epic: 'QRIS', category: 'Existing', mandaysByRole: { backend: 10, android: 10, ios: 10, qa: 10, qaAutomation: 12 }, dependencies: [] },
  { id: '63', projectId: 'P1', title: 'Aktivasi Notifikasi', epic: 'Notification', category: 'Existing', mandaysByRole: { backend: 3, android: 1.5, ios: 1.5, qa: 3, qaAutomation: 2.55 }, dependencies: [] },
  { id: '59', projectId: 'P1', title: 'Deposito', epic: 'Produk Jasa', category: 'Existing', mandaysByRole: { backend: 10, android: 13, ios: 13, qa: 13, qaAutomation: 14.1 }, dependencies: [] },
  { id: '34', projectId: 'P1', title: 'Withdraw (Quick)', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '3', projectId: 'P1', title: 'Pajak Signal', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 3, android: 3, ios: 3, qa: 3, qaAutomation: 3.6 }, dependencies: [] },
  { id: '4', projectId: 'P1', title: 'Pajak Toska', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 3, android: 3, ios: 3, qa: 3, qaAutomation: 3.6 }, dependencies: [] },
  { id: '72', projectId: 'P1', title: 'Tarik Tunai (ATM)', epic: 'Tarik Tunai', category: 'Existing', mandaysByRole: { backend: 8, android: 4, ios: 4, qa: 8, qaAutomation: 6.8 }, dependencies: [] },
  { id: '77', projectId: 'P1', title: 'Pajak PBB', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 6, ios: 6, qa: 6, qaAutomation: 6.2 }, dependencies: [] },
  { id: '79', projectId: 'P1', title: 'Pajak MPN', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 2, ios: 2, qa: 4, qaAutomation: 3.4 }, dependencies: [] },
  { id: '73', projectId: 'P1', title: 'Tarik Tunai (Indomaret)', epic: 'Tarik Tunai', category: 'Existing', mandaysByRole: { backend: 8, android: 4, ios: 4, qa: 8, qaAutomation: 6.8 }, dependencies: [] },
  { id: '86', projectId: 'P1', title: 'Tiket Pesawat (Transportasi)', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 5, android: 6, ios: 6, qa: 6, qaAutomation: 6.7 }, dependencies: [] },
  { id: '92', projectId: 'P1', title: 'JakErte', epic: 'Produk Jasa & Info Rekening', category: 'Existing', mandaysByRole: { backend: 5, android: 4, ios: 4, qa: 5, qaAutomation: 5.3 }, dependencies: [] },

  // Sprint 5
  { id: '57', projectId: 'P1', title: 'E-Wallet', epic: 'Top Up', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '52', projectId: 'P1', title: 'Ubah PIN Kartu', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 3, android: 3, ios: 3, qa: 3, qaAutomation: 3.6 }, dependencies: [] },
  { id: '53', projectId: 'P1', title: 'Atur Limit', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 7, android: 3.5, ios: 3.5, qa: 7, qaAutomation: 5.95 }, dependencies: [] },
  { id: '54', projectId: 'P1', title: 'Control Transaction', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 2, android: 3.5, ios: 3.5, qa: 4, qaAutomation: 3.45 }, dependencies: [] },
  { id: '12', projectId: 'P1', title: 'MPM With Tip', epic: 'QRIS', category: 'Existing', mandaysByRole: { backend: 2, android: 2, ios: 2, qa: 2, qaAutomation: 2.4 }, dependencies: [] },
  { id: '89', projectId: 'P1', title: 'Virtual Account', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '75', projectId: 'P1', title: 'Multifinance', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 10, android: 5.5, ios: 5.5, qa: 10, qaAutomation: 8.85 }, dependencies: [] },
  { id: '2', projectId: 'P1', title: 'Pendidikan', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 3, android: 3, ios: 3, qa: 3, qaAutomation: 3.6 }, dependencies: [] },
  { id: '76', projectId: 'P1', title: 'Kartu Kredit (Bayar)', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 6, ios: 6, qa: 6, qaAutomation: 6.2 }, dependencies: [] },
  { id: '67', projectId: 'P1', title: 'Reservasi Tiket KAI', epic: 'Lifestyle', category: 'Existing', mandaysByRole: { backend: 8, android: 11, ios: 11, qa: 11, qaAutomation: 11.7 }, dependencies: [] },
  { id: '5', projectId: 'P1', title: 'Asuransi', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 3, android: 3, ios: 3, qa: 3, qaAutomation: 3.6 }, dependencies: [] },
  { id: '6', projectId: 'P1', title: 'Retribusi', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 3, android: 3, ios: 3, qa: 3, qaAutomation: 3.6 }, dependencies: [] },
  { id: '65', projectId: 'P1', title: 'E-Voucher', epic: 'Lifestyle', category: 'Existing', mandaysByRole: { backend: 6, android: 5, ios: 5, qa: 6, qaAutomation: 6.5 }, dependencies: [] },
  { id: '58', projectId: 'P1', title: 'Top Up JakCard', epic: 'Top Up', category: 'Existing', mandaysByRole: { backend: 4, android: 5, ios: 5, qa: 5, qaAutomation: 5.5 }, dependencies: [] },
  { id: '78', projectId: 'P1', title: 'PGN', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 2, ios: 2, qa: 4, qaAutomation: 3.4 }, dependencies: [] },
  { id: '87', projectId: 'P1', title: 'Tiket Kereta', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 3, ios: 3, qa: 4, qaAutomation: 4.1 }, dependencies: [] },
  { id: '68', projectId: 'P1', title: 'Beli Tiket Pesawat', epic: 'Lifestyle', category: 'Existing', mandaysByRole: { backend: 8, android: 5, ios: 5, qa: 8, qaAutomation: 7.5 }, dependencies: [] },
  { id: '71', projectId: 'P1', title: 'Rekening Loan', epic: 'Buka Rekening', category: 'Existing', mandaysByRole: { backend: 8, android: 6, ios: 6, qa: 8, qaAutomation: 8.2 }, dependencies: [] },
  { id: '66', projectId: 'P1', title: 'Voucher Game', epic: 'Lifestyle', category: 'Existing', mandaysByRole: { backend: 6, android: 3, ios: 3, qa: 6, qaAutomation: 5.1 }, dependencies: [] },
  { id: '64', projectId: 'P1', title: 'Asuransi Kebakaran', epic: 'Lifestyle', category: 'Existing', mandaysByRole: { backend: 6, android: 4, ios: 4, qa: 6, qaAutomation: 5.8 }, dependencies: [] },
  { id: '95', projectId: 'P1', title: 'Kartu Kredit Indonesia', epic: 'Produk Jasa & Info Rekening', category: 'Existing', mandaysByRole: { backend: 5, android: 4, ios: 4, qa: 5, qaAutomation: 5.3 }, dependencies: [] },
  { id: '94', projectId: 'P1', title: 'KMG Online', epic: 'Produk Jasa & Info Rekening', category: 'Existing', mandaysByRole: { backend: 8, android: 12, ios: 12, qa: 12, qaAutomation: 12.4 }, dependencies: [] },

  // Sprint 6
  { id: '74', projectId: 'P1', title: 'Setor Tunai (Indomaret)', epic: 'Setor Tunai', category: 'Existing', mandaysByRole: { backend: 8, android: 4, ios: 4, qa: 8, qaAutomation: 6.8 }, dependencies: [] },
  { id: '11', projectId: 'P1', title: 'TAP - User Tapping', epic: 'QRIS', category: 'New Feature', mandaysByRole: { backend: 10, android: 10, ios: 10, qa: 10, qaAutomation: 12 }, dependencies: [] },
  { id: '102', projectId: 'P1', title: 'BI RTGS', epic: 'Transfer', category: 'New Feature', mandaysByRole: { backend: 7, android: 6, ios: 6, qa: 7, qaAutomation: 7.7 }, dependencies: [] },
  { id: '13', projectId: 'P1', title: 'Crossborder', epic: 'QRIS', category: 'New Feature', mandaysByRole: { backend: 10, android: 4, ios: 4, qa: 10, qaAutomation: 7.8 }, dependencies: [] },
  { id: '103', projectId: 'P1', title: 'QRIS Tuntas', epic: 'QRIS', category: 'New Feature', mandaysByRole: { backend: 20, android: 20, ios: 20, qa: 20, qaAutomation: 24 }, dependencies: [] },

  // Sprint 7 & 8 (Mapped to S7 for start)
  { id: '101', projectId: 'P1', title: 'Integrasi Debit VISA', epic: 'Integrasi Debit VISA', category: 'New Feature', mandaysByRole: { backend: 15, android: 20, ios: 20, qa: 20, qaAutomation: 21.5 }, dependencies: [] },
  { id: '105', projectId: 'P1', title: 'Tabungan Valas', epic: 'Tambah Rekening', category: 'New Feature', mandaysByRole: { backend: 20, android: 20, ios: 20, qa: 20, qaAutomation: 24 }, dependencies: [] },
  { id: '106', projectId: 'P1', title: 'Tabungan Haji', epic: 'Tambah Rekening', category: 'New Feature', mandaysByRole: { backend: 20, android: 20, ios: 20, qa: 20, qaAutomation: 24 }, dependencies: [] },
  
  // Foundation / Backlog Items
  { id: 'FOUND-MOB', projectId: 'P1', title: 'Foundation - Mobile', epic: 'Foundation', category: 'Foundation', mandaysByRole: { backend: 0, android: 12, ios: 12, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: 'FOUND-QA', projectId: 'P1', title: 'Foundation - QA Manual', epic: 'Foundation', category: 'Foundation', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: 'FOUND-QAA', projectId: 'P1', title: 'Foundation - QA Automation', epic: 'Foundation', category: 'Foundation', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 7 }, dependencies: [] },
  
  // Items without specific Sprint in Data or Valid Data
  { id: '91', projectId: 'P1', title: 'Mutasi Rekening (6 Bulan)', epic: 'Produk Jasa & Info Rekening', category: 'Existing', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: '104', projectId: 'P1', title: 'Remittance', epic: 'Transfer', category: 'New Feature', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: '107', projectId: 'P1', title: 'Jakarta', epic: 'Jakarta', category: 'New Feature', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: '108', projectId: 'P1', title: 'Fitur Program Promo', epic: 'Fitur Program Promo', category: 'New Feature', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: '109', projectId: 'P1', title: 'Laris Emas', epic: 'Laris Emas', category: 'New Feature', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 }, dependencies: [] },
];

// --- ASSIGNMENTS (Mapped from CSV Data) ---
export const INITIAL_ASSIGNMENTS: StoryAssignment[] = [
  // Sprint 1
  { userStoryId: '14', sprintSquadId: 'SS-S1-Squad 1' },
  { userStoryId: '22', sprintSquadId: 'SS-S1-Squad 2' },
  { userStoryId: '23', sprintSquadId: 'SS-S1-Squad 2' },
  { userStoryId: '24', sprintSquadId: 'SS-S1-Squad 3' },
  { userStoryId: '25', sprintSquadId: 'SS-S1-Squad 3' },
  { userStoryId: '35', sprintSquadId: 'SS-S1-Squad 2' },
  { userStoryId: '36', sprintSquadId: 'SS-S1-Squad 2' },
  { userStoryId: '37', sprintSquadId: 'SS-S1-Squad 2' },
  { userStoryId: '38', sprintSquadId: 'SS-S1-Squad 2' },

  // Sprint 2
  { userStoryId: '17', sprintSquadId: 'SS-S2-Squad 2' },
  { userStoryId: '15', sprintSquadId: 'SS-S2-Squad 1' },
  { userStoryId: '16', sprintSquadId: 'SS-S2-Squad 1' },
  { userStoryId: '27', sprintSquadId: 'SS-S2-Squad 1' },
  { userStoryId: '26', sprintSquadId: 'SS-S2-Squad 3' },
  { userStoryId: '41', sprintSquadId: 'SS-S2-Squad 3' },
  { userStoryId: '43', sprintSquadId: 'SS-S2-Squad 3' },
  { userStoryId: '44', sprintSquadId: 'SS-S2-Squad 3' },
  { userStoryId: '40', sprintSquadId: 'SS-S2-Squad 2' },
  { userStoryId: '42', sprintSquadId: 'SS-S2-Squad 2' },

  // Sprint 3
  { userStoryId: '110', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '111', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '113', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '114', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '29', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '30', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '31', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '18', sprintSquadId: 'SS-S3-Squad 4' },
  { userStoryId: '19', sprintSquadId: 'SS-S3-Squad 4' },
  { userStoryId: '81', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '21', sprintSquadId: 'SS-S3-Squad 4' },
  { userStoryId: '82', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '85', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '83', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '112', sprintSquadId: 'SS-S3-Squad 1' }, // Asumsi Squad 1 dari data
  { userStoryId: '84', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '48', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '55', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '47', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '49', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '60', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '45', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '61', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '62', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '39', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '46', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '80', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '7', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '20', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '69', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '70', sprintSquadId: 'SS-S3-Squad 2' },

  // Sprint 4
  { userStoryId: '50', sprintSquadId: 'SS-S4-Squad 3' },
  { userStoryId: '51', sprintSquadId: 'SS-S4-Squad 3' },
  { userStoryId: '28', sprintSquadId: 'SS-S4-Squad 2' },
  { userStoryId: '33', sprintSquadId: 'SS-S4-Squad 2' },
  { userStoryId: '8', sprintSquadId: 'SS-S4-Squad 4' },
  { userStoryId: '56', sprintSquadId: 'SS-S4-Squad 3' },
  { userStoryId: '9', sprintSquadId: 'SS-S4-Squad 4' },
  { userStoryId: '1', sprintSquadId: 'SS-S4-Squad 1' },
  { userStoryId: '10', sprintSquadId: 'SS-S4-Squad 4' },
  { userStoryId: '63', sprintSquadId: 'SS-S4-Squad 1' },
  { userStoryId: '59', sprintSquadId: 'SS-S4-Squad 1' },
  { userStoryId: '3', sprintSquadId: 'SS-S4-Squad 3' },
  { userStoryId: '4', sprintSquadId: 'SS-S4-Squad 3' },
  { userStoryId: '34', sprintSquadId: 'SS-S4-Squad 1' },
  { userStoryId: '72', sprintSquadId: 'SS-S4-Squad 1' },
  { userStoryId: '77', sprintSquadId: 'SS-S4-Squad 2' },
  { userStoryId: '79', sprintSquadId: 'SS-S4-Squad 2' },
  { userStoryId: '73', sprintSquadId: 'SS-S4-Squad 1' },
  { userStoryId: '86', sprintSquadId: 'SS-S4-Squad 3' },
  { userStoryId: '92', sprintSquadId: 'SS-S4-Squad 4' },

  // Sprint 5
  { userStoryId: '57', sprintSquadId: 'SS-S5-Squad 1' },
  { userStoryId: '52', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '53', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '54', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '12', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '89', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '75', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '2', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '76', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '67', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '5', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '6', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '65', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '78', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '87', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '68', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '58', sprintSquadId: 'SS-S5-Squad 1' },
  { userStoryId: '71', sprintSquadId: 'SS-S5-Squad 3' },
  { userStoryId: '66', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '64', sprintSquadId: 'SS-S5-Squad 4' },
  { userStoryId: '95', sprintSquadId: 'SS-S5-Squad 1' },
  { userStoryId: '94', sprintSquadId: 'SS-S5-Squad 1' },

  // Sprint 6
  { userStoryId: '74', sprintSquadId: 'SS-S6-Squad 1' },
  { userStoryId: '11', sprintSquadId: 'SS-S6-Squad 2' },
  { userStoryId: '102', sprintSquadId: 'SS-S6-Squad 1' },
  { userStoryId: '13', sprintSquadId: 'SS-S6-Squad 2' },
  { userStoryId: '103', sprintSquadId: 'SS-S6-Squad 2' },

  // Sprint 7 & 8 (Mapped to S7)
  { userStoryId: '101', sprintSquadId: 'SS-S7-Squad 1' },
  { userStoryId: '105', sprintSquadId: 'SS-S7-Squad 3' },
  { userStoryId: '106', sprintSquadId: 'SS-S7-Squad 3' },
  { userStoryId: 'FOUND-MOB', sprintSquadId: 'SS-S7-Squad 1' }, // Asumsi based on Squad 1 work
];