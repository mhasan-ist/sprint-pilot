
import { UserStory, Sprint, Squad, SprintSquad, StoryAssignment, Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  { id: 'P1', name: 'Jakarta Mobile 4.0', color: 'indigo', description: 'Transformasi digital perbankan inti dan fitur gaya hidup.' },
  { id: 'P2', name: 'Loan & Credit Engine', color: 'emerald', description: 'Sistem otomasi kredit dan integrasi skoring.' }
];

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

export const INITIAL_SQUADS: Squad[] = [
  { id: 'Squad 1', projectId: 'P1', name: 'Alpha - Core Onboarding' },
  { id: 'Squad 2', projectId: 'P1', name: 'Beta - Account Services' },
  { id: 'Squad 3', projectId: 'P1', name: 'Gamma - Cards & Security' },
  { id: 'Squad 4', projectId: 'P1', name: 'Delta - Payments & Transfer' },
];

export const INITIAL_SPRINT_SQUADS: SprintSquad[] = [];
// Populate SprintSquads for all Sprints and Squads
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

export const INITIAL_STORIES: UserStory[] = [
  { id: '14', projectId: 'P1', title: 'New to Bank (NTB)', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 15, android: 20, ios: 20, qa: 20, qaAutomation: 21.5 }, dependencies: [] },
  { id: '22', projectId: 'P1', title: 'Pre Login', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 2, android: 1, ios: 1, qa: 2, qaAutomation: 1.7 }, dependencies: [] },
  { id: '17', projectId: 'P1', title: 'Onboarding - Login', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 3, android: 4, ios: 4, qa: 4, qaAutomation: 4.3 }, dependencies: ['22'] },
  { id: '23', projectId: 'P1', title: 'Post Login', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 6, android: 5, ios: 5, qa: 6, qaAutomation: 6.5 }, dependencies: [] },
  { id: '24', projectId: 'P1', title: 'Account Listing', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 16, android: 10, ios: 10, qa: 16, qaAutomation: 15 }, dependencies: [] },
  { id: '15', projectId: 'P1', title: 'Aktivasi', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 5, android: 5, ios: 5, qa: 5, qaAutomation: 6 }, dependencies: [] },
  { id: '110', projectId: 'P1', title: 'Informasi Tabungan', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 2, android: 6, ios: 6, qa: 6, qaAutomation: 5.2 }, dependencies: [] },
  { id: '111', projectId: 'P1', title: 'Informasi Tabungan Rencana', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 10, android: 17, ios: 17, qa: 17, qaAutomation: 16.9 }, dependencies: [] },
  { id: '25', projectId: 'P1', title: 'Card Detail Page', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 6, android: 6, ios: 6, qa: 6, qaAutomation: 7.2 }, dependencies: [] },
  { id: '16', projectId: 'P1', title: 'Ganti Device', epic: 'Onboarding', category: 'Existing', mandaysByRole: { backend: 5, android: 5, ios: 5, qa: 5, qaAutomation: 6 }, dependencies: [] },
  { id: '27', projectId: 'P1', title: 'Detail Transaksi', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 1.5, android: 1, ios: 1, qa: 2, qaAutomation: 1.45 }, dependencies: [] },
  { id: '113', projectId: 'P1', title: 'Informasi Deposito', epic: 'Produk Jasa', category: 'Existing', mandaysByRole: { backend: 10, android: 13, ios: 13, qa: 13, qaAutomation: 14.1 }, dependencies: [] },
  { id: '114', projectId: 'P1', title: 'Informasi Pinjaman', epic: 'Buka Rekening', category: 'Existing', mandaysByRole: { backend: 8, android: 6, ios: 6, qa: 8, qaAutomation: 8.2 }, dependencies: [] },
  { id: '26', projectId: 'P1', title: 'Changed Featured Cards', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 1.5, android: 1, ios: 1, qa: 2, qaAutomation: 1.45 }, dependencies: [] },
  { id: '29', projectId: 'P1', title: 'Blocked Card', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 1, android: 1, ios: 1, qa: 1, qaAutomation: 1.2 }, dependencies: [] },
  { id: '30', projectId: 'P1', title: 'Expired Card', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 0.5, android: 1, ios: 1, qa: 1, qaAutomation: 0.95 }, dependencies: [] },
  { id: '31', projectId: 'P1', title: 'Unhide CVV', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 2.5, android: 3, ios: 3, qa: 3, qaAutomation: 3.35 }, dependencies: [] },
  { id: '50', projectId: 'P1', title: 'Block Card', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 2.5, android: 2, ios: 2, qa: 3, qaAutomation: 2.65 }, dependencies: [] },
  { id: '51', projectId: 'P1', title: 'Unblock Card', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 0.5, android: 0.5, ios: 0.5, qa: 1, qaAutomation: 0.6 }, dependencies: [] },
  { id: '18', projectId: 'P1', title: 'Flow On Us', epic: 'Transfer', category: 'Existing', mandaysByRole: { backend: 7, android: 6, ios: 6, qa: 7, qaAutomation: 7.7 }, dependencies: [] },
  { id: '19', projectId: 'P1', title: 'Flow Off Us', epic: 'Transfer', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '57', projectId: 'P1', title: 'E-Wallet', epic: 'Top Up', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '81', projectId: 'P1', title: 'PLN Postpaid', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 6, ios: 6, qa: 6, qaAutomation: 6.2 }, dependencies: [] },
  { id: '28', projectId: 'P1', title: 'E-Statement', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 5, android: 2.5, ios: 2.5, qa: 5, qaAutomation: 4.25 }, dependencies: [] },
  { id: '33', projectId: 'P1', title: 'Top-Up (Quick)', epic: 'Login & Account', category: 'Existing', mandaysByRole: { backend: 4, android: 5, ios: 5, qa: 5, qaAutomation: 5.5 }, dependencies: [] },
  { id: '52', projectId: 'P1', title: 'Ubah PIN Kartu', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 3, android: 3, ios: 3, qa: 3, qaAutomation: 3.6 }, dependencies: [] },
  { id: '53', projectId: 'P1', title: 'Atur Limit', epic: 'Akun - Kartu', category: 'Existing', mandaysByRole: { backend: 7, android: 3.5, ios: 3.5, qa: 7, qaAutomation: 5.95 }, dependencies: [] },
  { id: '21', projectId: 'P1', title: 'Atur Favorit', epic: 'Transfer', category: 'Existing', mandaysByRole: { backend: 6, android: 6, ios: 6, qa: 6, qaAutomation: 7.2 }, dependencies: [] },
  { id: '8', projectId: 'P1', title: 'MPM - Scan QR', epic: 'QRIS', category: 'Existing', mandaysByRole: { backend: 10, android: 8, ios: 8, qa: 10, qaAutomation: 10.6 }, dependencies: [] },
  { id: '82', projectId: 'P1', title: 'PLN Non Taglis', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 2, ios: 2, qa: 4, qaAutomation: 3.4 }, dependencies: [] },
  { id: '85', projectId: 'P1', title: 'TV Kabel', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '83', projectId: 'P1', title: 'Pascabayar', epic: 'Pembayaran', category: 'Existing', mandaysByRole: { backend: 4, android: 4, ios: 4, qa: 4, qaAutomation: 4.8 }, dependencies: [] },
  { id: '101', projectId: 'P1', title: 'Integrasi Debit VISA', epic: 'Integrasi Debit VISA', category: 'New Feature', mandaysByRole: { backend: 15, android: 20, ios: 20, qa: 20, qaAutomation: 21.5 }, dependencies: [] },
  { id: '103', projectId: 'P1', title: 'QRIS Tuntas', epic: 'QRIS', category: 'New Feature', mandaysByRole: { backend: 20, android: 20, ios: 20, qa: 20, qaAutomation: 24 }, dependencies: [] },
  { id: 'FOUND-MOB', projectId: 'P1', title: 'Foundation - Mobile Setup', epic: 'Foundation', category: 'Foundation', mandaysByRole: { backend: 0, android: 12, ios: 12, qa: 0, qaAutomation: 0 }, dependencies: [] },
  { id: 'FOUND-QA', projectId: 'P1', title: 'Foundation - QA Automation Framework', epic: 'Foundation', category: 'Foundation', mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 7 }, dependencies: [] },
];

export const INITIAL_ASSIGNMENTS: StoryAssignment[] = [
  { userStoryId: '14', sprintSquadId: 'SS-S1-Squad 1' },
  { userStoryId: '22', sprintSquadId: 'SS-S1-Squad 2' },
  { userStoryId: '23', sprintSquadId: 'SS-S1-Squad 2' },
  { userStoryId: '24', sprintSquadId: 'SS-S1-Squad 3' },
  { userStoryId: '17', sprintSquadId: 'SS-S2-Squad 2' },
  { userStoryId: '15', sprintSquadId: 'SS-S2-Squad 1' },
  { userStoryId: '16', sprintSquadId: 'SS-S2-Squad 1' },
  { userStoryId: '27', sprintSquadId: 'SS-S2-Squad 1' },
  { userStoryId: '26', sprintSquadId: 'SS-S2-Squad 3' },
  { userStoryId: '110', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '111', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '113', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '114', sprintSquadId: 'SS-S3-Squad 2' },
  { userStoryId: '29', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '30', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '31', sprintSquadId: 'SS-S3-Squad 3' },
  { userStoryId: '18', sprintSquadId: 'SS-S3-Squad 4' },
  { userStoryId: '19', sprintSquadId: 'SS-S3-Squad 4' },
  { userStoryId: '21', sprintSquadId: 'SS-S3-Squad 4' },
  { userStoryId: '81', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '82', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '85', sprintSquadId: 'SS-S3-Squad 1' },
  { userStoryId: '83', sprintSquadId: 'SS-S3-Squad 1' },
];
