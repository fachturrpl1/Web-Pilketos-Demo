import { supabase, handleSupabaseError, handleSupabaseSuccess } from './supabase'
import { 
  Candidate, 
  CandidateInsert, 
  CandidateUpdate,
  Voter, 
  VoterInsert, 
  VoterUpdate,
  ElectionSettings, 
  ElectionSettingsInsert, 
  ElectionSettingsUpdate,
  User, 
  UserInsert, 
  UserUpdate,
  ApiResponse,
  PaginatedResponse
} from '@/types/database'

// ==================== CANDIDATES ====================

export const getCandidates = async (): Promise<ApiResponse<Candidate[]>> => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data || [])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const getCandidateById = async (id: number): Promise<ApiResponse<Candidate>> => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const createCandidate = async (candidate: CandidateInsert): Promise<ApiResponse<Candidate>> => {
  try {
    console.log('Creating candidate in database:', candidate)
    const { data, error } = await supabase
      .from('candidates')
      .insert([candidate])
      .select()

    console.log('Supabase insert response:', { data, error })

    if (error) {
      console.error('Supabase insert error:', error)
      return handleSupabaseError(error)
    }

    // Pastikan data ada dan ambil elemen pertama
    if (!data || data.length === 0) {
      console.error('No data returned from insert')
      return handleSupabaseError(new Error('No data returned from insert'))
    }

    console.log('Successfully created candidate:', data[0])
    return handleSupabaseSuccess(data[0])
  } catch (error) {
    console.error('Create candidate error:', error)
    return handleSupabaseError(error)
  }
}

export const updateCandidate = async (id: number, candidate: CandidateUpdate): Promise<ApiResponse<Candidate>> => {
  try {
    console.log('updateCandidate called with:', { id, candidate })
    
    const updateData = { ...candidate, update_at: new Date().toISOString() }
    console.log('Update data to send:', updateData)
    
    const { data, error } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', id)
      .select()

    console.log('Supabase update response:', { data, error })

    if (error) {
      console.error('Supabase update error:', error)
      return handleSupabaseError(error)
    }

    // Cek apakah data ada
    if (!data || data.length === 0) {
      // Coba ambil data kandidat untuk memastikan ID ada
      const { data: existingData, error: fetchError } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !existingData) {
        return handleSupabaseError(new Error(`Kandidat dengan ID ${id} tidak ditemukan`))
      }

      // Jika data ada tapi update tidak mengembalikan data, 
      // kemungkinan tidak ada perubahan yang signifikan
      return handleSupabaseSuccess(existingData)
    }

    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const deleteCandidate = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id)

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(undefined)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// ==================== VOTERS ====================

export const getVoters = async (): Promise<ApiResponse<Voter[]>> => {
  try {
    const { data, error } = await supabase
      .from('voters')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data || [])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const getVoterById = async (id: number): Promise<ApiResponse<Voter>> => {
  try {
    const { data, error } = await supabase
      .from('voters')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const createVoter = async (voter: VoterInsert): Promise<ApiResponse<Voter>> => {
  try {
    const { data, error } = await supabase
      .from('voters')
      .insert([voter])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    // Pastikan data ada dan ambil elemen pertama
    if (!data || data.length === 0) {
      return handleSupabaseError(new Error('No data returned from insert'))
    }

    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const updateVoter = async (id: number, voter: VoterUpdate): Promise<ApiResponse<Voter>> => {
  try {
    const { data, error } = await supabase
      .from('voters')
      .update({ ...voter, update_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    // Cek apakah data ada
    if (!data || data.length === 0) {
      // Coba ambil data voter untuk memastikan ID ada
      const { data: existingData, error: fetchError } = await supabase
        .from('voters')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !existingData) {
        return handleSupabaseError(new Error(`Voter dengan ID ${id} tidak ditemukan`))
      }

      // Jika data ada tapi update tidak mengembalikan data, 
      // kemungkinan tidak ada perubahan yang signifikan
      return handleSupabaseSuccess(existingData)
    }

    return handleSupabaseSuccess(data[0])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const deleteVoter = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from('voters')
      .delete()
      .eq('id', id)

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(undefined)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const voteForCandidate = async (voterId: number, candidateId: number): Promise<ApiResponse<Voter>> => {
  try {
    // Update voter's vote
    const { data: voterData, error: voterError } = await supabase
      .from('voters')
      .update({ 
        has_voted: true, 
        voted_for: candidateId, 
        voted_at: new Date().toISOString(),
        update_at: new Date().toISOString()
      })
      .eq('id', voterId)
      .select()
      .single()

    if (voterError) {
      return handleSupabaseError(voterError)
    }

    // Increment candidate's vote count
    const { error: candidateError } = await supabase.rpc('increment_votes', {
      candidate_id: candidateId
    })

    if (candidateError) {
      return handleSupabaseError(candidateError)
    }

    return handleSupabaseSuccess(voterData)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// ==================== ELECTION SETTINGS ====================

export const getElectionSettings = async (): Promise<ApiResponse<ElectionSettings>> => {
  try {
    const { data, error } = await supabase
      .from('election_settings')
      .select('*')
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const updateElectionSettings = async (settings: ElectionSettingsUpdate): Promise<ApiResponse<ElectionSettings>> => {
  try {
    const { data, error } = await supabase
      .from('election_settings')
      .update({ ...settings, update_at: new Date().toISOString() })
      .eq('id', 1) // Assuming single election settings record
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// ==================== USERS ====================

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data || [])
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const createUser = async (user: UserInsert): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const updateUser = async (id: string, user: UserUpdate): Promise<ApiResponse<User>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ ...user, update_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(data)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const deleteUser = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      return handleSupabaseError(error)
    }

    return handleSupabaseSuccess(undefined)
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// ==================== STATISTICS ====================

export const getElectionStats = async (): Promise<ApiResponse<{
  totalVoters: number
  votedCount: number
  remainingVoters: number
  participationRate: number
  totalCandidates: number
}>> => {
  try {
    // Get voters count
    const { count: totalVoters, error: votersError } = await supabase
      .from('voters')
      .select('*', { count: 'exact', head: true })

    if (votersError) {
      return handleSupabaseError(votersError)
    }

    // Get voted count
    const { count: votedCount, error: votedError } = await supabase
      .from('voters')
      .select('*', { count: 'exact', head: true })
      .eq('has_voted', true)

    if (votedError) {
      return handleSupabaseError(votedError)
    }

    // Get candidates count
    const { count: totalCandidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })

    if (candidatesError) {
      return handleSupabaseError(candidatesError)
    }

    const stats = {
      totalVoters: totalVoters || 0,
      votedCount: votedCount || 0,
      remainingVoters: (totalVoters || 0) - (votedCount || 0),
      participationRate: totalVoters ? ((votedCount || 0) / totalVoters) * 100 : 0,
      totalCandidates: totalCandidates || 0
    }

    return handleSupabaseSuccess(stats)
  } catch (error) {
    return handleSupabaseError(error)
  }
}




