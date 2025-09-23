"use client"

import { useState, useEffect } from 'react'
import { Voter, VoterInsert, VoterUpdate } from '@/types/database'
import { 
  getVoters, 
  createVoter, 
  updateVoter, 
  deleteVoter 
} from '@/lib/data-service'

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVoters = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getVoters()
      
      if (result.success && result.data) {
        setVoters(result.data)
      } else {
        setError(result.error || 'Failed to fetch voters')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addVoter = async (voterData: VoterInsert) => {
    try {
      const result = await createVoter(voterData)
      
      if (result.success && result.data) {
        setVoters(prev => [result.data!, ...prev])
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const editVoter = async (id: number, voterData: VoterUpdate) => {
    try {
      const result = await updateVoter(id, voterData)
      
      if (result.success && result.data) {
        setVoters(prev => 
          prev.map(voter => 
            voter.id === id ? result.data! : voter
          )
        )
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const removeVoter = async (id: number) => {
    try {
      const result = await deleteVoter(id)
      
      if (result.success) {
        setVoters(prev => prev.filter(voter => voter.id !== id))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  useEffect(() => {
    fetchVoters()
  }, [])

  return {
    voters,
    loading,
    error,
    refetch: fetchVoters,
    addVoter,
    editVoter,
    removeVoter
  }
}


