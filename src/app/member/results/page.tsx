"use client"

import { ResultsChart } from "@/components/results-chart"
import { useCandidates } from "@/hooks/use-candidates"
import { useVoters } from "@/hooks/use-voters"
import { useElectionSettings } from "@/hooks/use-election-settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageLayout } from "@/components/page-layout"
import { IconTrophy, IconClock, IconLoader2 } from "@tabler/icons-react"

export default function MemberResults() {
  const { candidates, loading: candidatesLoading, error: candidatesError, refetch: refetchCandidates } = useCandidates()
  const { voters, loading: votersLoading, error: votersError, refetch: refetchVoters } = useVoters()
  const { settings, loading: settingsLoading } = useElectionSettings()

  const handleRefresh = () => {
    refetchCandidates()
    refetchVoters()
  }

  // If election is active, hide results and show notice
  if (settingsLoading || candidatesLoading || votersLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat hasil pemilihan...</span>
        </div>
      </PageLayout>
    )
  }

  if (settings?.is_active) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hasil Pemilihan Ketua OSIS</h1>
            <p className="text-gray-600">Lihat hasil pemilihan dan statistik voting</p>
          </div>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Hasil akan diumumkan setelah voting selesai</h3>
              <p className="text-sm text-amber-800">Silakan kembali lagi setelah periode pemilihan berakhir.</p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  const votesMap: Record<number, number> = voters.reduce((acc, voter) => {
    if (voter.has_voted && voter.voted_for) {
      acc[voter.voted_for] = (acc[voter.voted_for] || 0) + 1
    }
    return acc
  }, {} as Record<number, number>)

  const candidatesWithVotes = candidates.map(c => ({
    ...c,
    votes: votesMap[c.id] || 0,
  }))

  const totalVotes = candidatesWithVotes.reduce((sum: number, candidate) => sum + candidate.votes, 0)
  const winner = candidatesWithVotes.length > 0 ? candidatesWithVotes.reduce((prev, current) => 
    prev.votes > current.votes ? prev : current
  ) : null

  const error = candidatesError || votersError
  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={() => handleRefresh()} className="px-4 py-2 bg-blue-500 text-white rounded">
            Coba Lagi
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hasil Pemilihan Ketua OSIS</h1>
        <p className="text-gray-600">Lihat hasil pemilihan dan statistik voting</p>
      </div>

      {/* Winner Announcement */}
      {winner && totalVotes > 0 && (
        <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <IconTrophy className="h-12 w-12" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Pemenang Sementara</h2>
                <h3 className="text-xl font-semibold">{winner.name}</h3>
                <p className="text-yellow-100">{winner.class}</p>
                <p className="text-yellow-100">{winner.votes} suara</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="text-2xl font-bold">{candidatesWithVotes.length}</div>
            <p className="text-xs text-gray-500">kandidat terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <IconClock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Selesai</span>
            </div>
            <p className="text-xs text-gray-500">Pemilihan selesai</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <ResultsChart 
        candidates={candidatesWithVotes} 
        onRefresh={handleRefresh}
      />

      {/* Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Catatan Penting</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>Hasil yang ditampilkan adalah hasil sementara</li>
            <li>Data akan diperbarui secara real-time selama periode voting</li>
            <li>Hasil final akan diumumkan setelah periode voting selesai</li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </PageLayout>
  )
}

