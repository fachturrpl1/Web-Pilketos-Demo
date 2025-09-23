"use client"

import { PageLayout } from "@/components/page-layout"
import { VotingForm } from "@/components/voting-form"
import { useCandidates } from "@/hooks/use-candidates"
import { useVoters } from "@/hooks/use-voters"
import { useElectionSettings } from "@/hooks/use-election-settings"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { IconLoader2 } from "@tabler/icons-react"

export default function MemberVoting() {
  const { candidates, loading, error } = useCandidates()
  const { voters } = useVoters()
  const { settings, loading: settingsLoading } = useElectionSettings()
  const [hasVoted, setHasVoted] = useState(false)
  const [votedFor, setVotedFor] = useState<number | undefined>(undefined)

  const handleVote = (candidateId: number) => {
    setHasVoted(true)
    setVotedFor(candidateId)
    alert(`Vote berhasil diberikan untuk kandidat dengan ID: ${candidateId}`)
  }

  if (loading || settingsLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat data kandidat...</span>
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

  // Hitung jumlah suara per kandidat dari tabel voters
  const candidateIdToVotes = new Map<number, number>()
  voters?.forEach(v => {
    if (v.voted_for != null) {
      candidateIdToVotes.set(v.voted_for, (candidateIdToVotes.get(v.voted_for) || 0) + 1)
    }
  })

  const candidatesWithVotes = candidates.map(c => ({
    ...c,
    votes: candidateIdToVotes.get(c.id) || 0
  }))

  const isActive = settings?.is_active ?? false
  const allowVoting = settings?.allow_voting ?? false

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voting Ketua OSIS</h1>
          <p className="text-gray-600">Pilih kandidat terbaik untuk memimpin OSIS</p>
        </div>

        {!isActive ? (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-amber-900">Pemilihan telah berakhir</h3>
              <p className="text-sm text-amber-800">Terima kasih atas partisipasi Anda.</p>
            </CardContent>
          </Card>
        ) : !allowVoting ? (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-amber-900">Voting belum diizinkan</h3>
              <p className="text-sm text-amber-800">Harap menunggu sampai voting dibuka oleh panitia.</p>
            </CardContent>
          </Card>
        ) : (
          <VotingForm
            candidates={candidatesWithVotes}
            onVote={handleVote}
            hasVoted={hasVoted}
            votedFor={votedFor}
          />
        )}
      </div>
    </PageLayout>
  )
}

