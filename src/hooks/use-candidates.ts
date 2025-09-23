"use client"

import { useState, useEffect } from 'react'
import { Candidate, CandidateInsert, CandidateUpdate } from '@/types/database'
import { 
  getCandidates, 
  createCandidate, 
  updateCandidate, 
  deleteCandidate 
} from '@/lib/data-service'

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getCandidates()
      
      if (result.success && result.data) {
        setCandidates(result.data)
      } else {
        setError(result.error || 'Failed to fetch candidates')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addCandidate = async (candidateData: CandidateInsert) => {
    try {
      console.log('Adding candidate data:', candidateData)
      const result = await createCandidate(candidateData)
      console.log('Create candidate result:', result)
      
      if (result.success && result.data) {
        console.log('Adding to state:', result.data)
        setCandidates(prev => {
          const newCandidates = [result.data!, ...prev]
          console.log('New candidates state:', newCandidates)
          return newCandidates
        })
        return { success: true }
      } else {
        console.error('Failed to create candidate:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Add candidate error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const editCandidate = async (id: number, candidateData: CandidateUpdate) => {
    try {
      console.log('Editing candidate:', id, candidateData)
      const result = await updateCandidate(id, candidateData)
      console.log('Update candidate result:', result)
      
      if (result.success && result.data) {
        console.log('Updating state with:', result.data)
        setCandidates(prev => {
          const updatedCandidates = prev.map(candidate => 
            candidate.id === id ? result.data! : candidate
          )
          console.log('Updated candidates state:', updatedCandidates)
          return updatedCandidates
        })
        return { success: true }
      } else {
        console.error('Failed to update candidate:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Edit candidate error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const removeCandidate = async (id: number) => {
    try {
      const result = await deleteCandidate(id)
      
      if (result.success) {
        setCandidates(prev => prev.filter(candidate => candidate.id !== id))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates,
    addCandidate,
    editCandidate,
    removeCandidate
  }
}


