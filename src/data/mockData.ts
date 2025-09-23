import { Candidate, Voter, ElectionSettings, ElectionStats } from '@/types'

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Ahmad Rizki Pratama',
    class: 'XII IPA 1',
    photo: '/avatars/candidate1.jpg',
    vision: 'Mewujudkan OSIS yang inovatif, kreatif, dan berprestasi untuk kemajuan sekolah',
    mission: '1. Meningkatkan kualitas kegiatan ekstrakurikuler\n2. Mengembangkan program literasi digital\n3. Memperkuat solidaritas antar siswa\n4. Menciptakan lingkungan belajar yang kondusif',
    votes: 45
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    class: 'XII IPS 2',
    photo: '/avatars/candidate2.jpg',
    vision: 'OSIS yang solid, progresif, dan berkarakter untuk masa depan yang gemilang',
    mission: '1. Mengoptimalkan peran OSIS dalam kegiatan sekolah\n2. Meningkatkan partisipasi siswa dalam berbagai kegiatan\n3. Mengembangkan bakat dan minat siswa\n4. Menjalin komunikasi yang baik dengan pihak sekolah',
    votes: 38
  },
  {
    id: '3',
    name: 'Muhammad Fauzi',
    class: 'XII IPA 3',
    photo: '/avatars/candidate3.jpg',
    vision: 'Membangun OSIS yang berintegritas, berprestasi, dan bermanfaat bagi semua',
    mission: '1. Menciptakan program yang inovatif dan bermanfaat\n2. Meningkatkan kualitas kepemimpinan siswa\n3. Mengembangkan potensi siswa di berbagai bidang\n4. Memperkuat hubungan dengan alumni',
    votes: 42
  }
]

export const mockVoters: Voter[] = [
  { id: '1', name: 'Andi Wijaya', class: 'XII IPA 1', hasVoted: true, votedFor: '1', votedAt: new Date('2024-01-15T10:30:00') },
  { id: '2', name: 'Budi Santoso', class: 'XII IPA 2', hasVoted: true, votedFor: '2', votedAt: new Date('2024-01-15T11:15:00') },
  { id: '3', name: 'Citra Dewi', class: 'XII IPS 1', hasVoted: false },
  { id: '4', name: 'Dedi Kurniawan', class: 'XII IPA 3', hasVoted: true, votedFor: '3', votedAt: new Date('2024-01-15T14:20:00') },
  { id: '5', name: 'Eka Putri', class: 'XII IPS 2', hasVoted: false },
  { id: '6', name: 'Fajar Nugroho', class: 'XII IPA 1', hasVoted: true, votedFor: '1', votedAt: new Date('2024-01-15T15:45:00') },
  { id: '7', name: 'Gita Sari', class: 'XII IPS 3', hasVoted: false },
  { id: '8', name: 'Hendra Pratama', class: 'XII IPA 2', hasVoted: true, votedFor: '2', votedAt: new Date('2024-01-15T16:10:00') },
  { id: '9', name: 'Indira Lestari', class: 'XII IPS 1', hasVoted: false },
  { id: '10', name: 'Joko Susilo', class: 'XII IPA 3', hasVoted: true, votedFor: '3', votedAt: new Date('2024-01-15T16:30:00') }
]

export const mockElectionSettings: ElectionSettings = {
  startDate: new Date('2024-01-15T08:00:00'),
  endDate: new Date('2024-01-20T17:00:00'),
  isActive: true,
  allowVoting: true
}

export const mockElectionStats: ElectionStats = {
  totalVoters: mockVoters.length,
  votedCount: mockVoters.filter(v => v.hasVoted).length,
  remainingVoters: mockVoters.filter(v => !v.hasVoted).length,
  participationRate: (mockVoters.filter(v => v.hasVoted).length / mockVoters.length) * 100
}
