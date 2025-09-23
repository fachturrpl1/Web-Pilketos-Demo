"use client"

import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ResultsChart } from "@/components/results-chart"
import { useCandidates } from "@/hooks/use-candidates"
import { useVoters } from "@/hooks/use-voters"
import { useElectionSettings } from "@/hooks/use-election-settings"
import { IconTrophy, IconLoader2, IconCheck, IconSearch } from "@tabler/icons-react"
import { useState } from "react"

export default function PanitiaResults() {
  const { candidates, loading: candidatesLoading, error: candidatesError } = useCandidates()
  const { voters, loading: votersLoading, error: votersError } = useVoters()
  const { settings } = useElectionSettings()
  const [search, setSearch] = useState("")

  const loading = candidatesLoading || votersLoading
  const error = candidatesError || votersError

  // Aggregate votes from voters table
  const candidateIdToVotes = new Map<number, number>()
  voters.forEach(v => {
    if (v.voted_for != null) {
      candidateIdToVotes.set(v.voted_for, (candidateIdToVotes.get(v.voted_for) || 0) + 1)
    }
  })

  const candidatesWithVotes = candidates.map(c => ({
    ...c,
    votes: candidateIdToVotes.get(c.id) || 0
  }))

  const filtered = candidatesWithVotes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.class.toLowerCase().includes(search.toLowerCase())
  )

  const totalVotes = voters.filter(v => v.has_voted).length
  const isActive = settings?.is_active ?? true
  const winner = candidatesWithVotes.length > 0 ? candidatesWithVotes.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  ) : null

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat hasil pemilihan...</span>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded">
            Coba Lagi
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hasil Pemilihan</h1>
            <p className="text-gray-600">Ringkasan perolehan suara kandidat</p>
          </div>
        </div>

        {winner && (
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-6">
                <IconTrophy className="h-16 w-16" />
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Peringkat Teratas</h2>
                  <h3 className="text-2xl font-semibold mb-2">{winner.name}</h3>
                  <p className="text-yellow-100 text-lg">{winner.class}</p>
                  <div className="mt-4 bg-yellow-600 bg-opacity-50 rounded-lg p-4">
                    <p className="text-2xl font-bold">{winner.votes} suara</p>
                    <p className="text-yellow-100">
                      {totalVotes > 0 ? ((winner.votes / totalVotes) * 100).toFixed(1) : 0}% dari total suara
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Suara</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
              <p className="text-xs text-gray-500">suara terkumpul</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Kandidat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{candidates.length}</div>
              <p className="text-xs text-gray-500">kandidat terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{isActive ? 'Berlangsung' : 'Selesai'}</span>
              </div>
              <p className="text-xs text-gray-500">{isActive ? 'Pemilihan aktif' : 'Pemilihan berakhir'}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hasil Detail per Kandidat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  className="w-full border rounded px-9 py-2 text-sm"
                  placeholder="Cari nama atau kelas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              {filtered
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => {
                  const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0'
                  const isWinner = winner && candidate.id === winner.id
                  return (
                    <div key={candidate.id} className={`p-4 rounded-lg border-2 ${isWinner ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <p className="text-gray-600">{candidate.class}</p>
                          </div>
                          {isWinner && (
                            <Badge className="bg-yellow-100 text-yellow-70">Peringkat 1</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{candidate.votes}</div>
                          <div className="text-sm text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <ResultsChart candidates={candidatesWithVotes} />
      </div>
    </PageLayout>
  )
}