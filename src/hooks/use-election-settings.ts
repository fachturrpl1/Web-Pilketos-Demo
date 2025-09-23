"use client"

import { useEffect, useState } from "react"
import { getElectionSettings, updateElectionSettings } from "@/lib/data-service"
import { ElectionSettings, ElectionSettingsUpdate } from "@/types/database"

export function useElectionSettings() {
  const [settings, setSettings] = useState<ElectionSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getElectionSettings()
      if (result.success && result.data) {
        setSettings(result.data)
      } else {
        setError(result.error || "Failed to fetch election settings")
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updateData: ElectionSettingsUpdate) => {
    try {
      const result = await updateElectionSettings(updateData)
      if (result.success && result.data) {
        setSettings(result.data)
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.error }
      }
    } catch {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return { settings, loading, error, refetch: fetchSettings, updateSettings }
}
