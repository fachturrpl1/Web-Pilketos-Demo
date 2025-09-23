"use client"

import { PageLayout } from "@/components/page-layout"
import { CandidateCard } from "@/components/candidate-card"
import { useCandidates } from "@/hooks/use-candidates"
import { useVoters } from "@/hooks/use-voters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconLoader2 } from "@tabler/icons-react"

export default function MemberCandidates() {
  const { candidates, loading, error } = useCandidates()
  const { voters } = useVoters()

  // Map votes from voters.voted_for so badge shows real counts
  const votesMap = new Map<number, number>()
  voters?.forEach(v => {
    if (v.voted_for != null) {
      votesMap.set(v.voted_for, (votesMap.get(v.voted_for) || 0) + 1)
    }
  })
  const candidatesWithVotes = candidates.map(c => ({ ...c, votes: votesMap.get(c.id) || 0 }))

  if (loading) {
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

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Kandidat Ketua OSIS</h1>
          <p className="text-gray-600">Kenali lebih dekat visi dan misi setiap kandidat</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Daftar Kandidat ({candidates.length} orang)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidatesWithVotes.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  showVoteButton={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Cara Memilih</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Baca visi dan misi setiap kandidat dengan klik tombol Lihat Detail</li>
              <li>Pertimbangkan dengan matang kandidat mana yang paling sesuai</li>
              <li>Klik tombol voting di menu untuk memberikan suara Anda</li>
              <li>Pilih kandidat yang Anda inginkan dan konfirmasi pilihan</li>
              <li>Pastikan Anda telah memilih dengan benar sebelum mengkonfirmasi</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

