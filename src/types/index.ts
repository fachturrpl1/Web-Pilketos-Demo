export interface Candidate {
  id: number
  name: string
  class: string
  photo_url: string | null
  vision: string
  mission: string[]
  votes: number
  created_at: string
  update_at: string
}

export interface Voter {
  id: string
  name: string
  class: string
  hasVoted: boolean
  votedFor?: string
  votedAt?: Date
}

export interface ElectionSettings {
  startDate: Date
  endDate: Date
  isActive: boolean
  allowVoting: boolean
}

export interface ElectionStats {
  totalVoters: number
  votedCount: number
  remainingVoters: number
  participationRate: number
}






