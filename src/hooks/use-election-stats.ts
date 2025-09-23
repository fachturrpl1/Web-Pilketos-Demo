"use client"

import { useState, useEffect } from 'react'
import { getElectionStats } from '@/lib/data-service'

export interface ElectionStats {
  totalVoters: number
  votedCount: number
  remainingVoters: number
  participationRate: number
  totalCandidates: number
}

export function useElectionStats() {
  const [stats, setStats] = useState<ElectionStats>({
    totalVoters: 0,
    votedCount: 0,
    remainingVoters: 0,
    participationRate: 0,
    totalCandidates: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getElectionStats()
      
      if (result.success && result.data) {
        setStats(result.data)
      } else {
        setError(result.error || 'Failed to fetch election stats')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}


