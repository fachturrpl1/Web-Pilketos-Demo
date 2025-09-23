"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// Dialog component not available, using simple modal instead
import { CandidateCard } from "@/components/candidate-card"
import { Candidate } from "@/types"
import { createVoter } from "@/lib/data-service"
import { VoterInsert } from "@/types/database"
import { IconCheck } from "@tabler/icons-react"

interface VotingFormProps {
  candidates: Candidate[]
  onVote: (candidateId: string) => void
  hasVoted: boolean
  votedFor?: string
}

export function VotingForm({ candidates, onVote, hasVoted, votedFor }: VotingFormProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  // Konfirmasi tidak digunakan, vote instan setelah form disimpan
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showVoterForm, setShowVoterForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    email: ""
  })
  const [formError, setFormError] = useState<string | null>(null)

  const handleVoteClick = (candidateId: string) => {
    setSelectedCandidate(candidateId)
    setShowVoterForm(true)
  }

  const handleSubmitVoterForm = async () => {
    if (!selectedCandidate) return
    setFormError(null)
    if (!formData.name.trim() || !formData.class.trim() || !formData.email.trim()) {
      setFormError("Nama, Kelas, dan Email wajib diisi.")
      return
    }
    setIsSubmitting(true)
    try {
      const payload: VoterInsert = {
        name: formData.name.trim(),
        class: formData.class.trim(),
        email: formData.email.trim(),
        has_voted: true,
        voted_for: Number(selectedCandidate),
        voted_at: new Date().toISOString(),
      }
      const result = await createVoter(payload)
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Gagal menyimpan data pemilih')
      }
      setShowVoterForm(false)
      // Selesaikan voting segera setelah data pemilih tersimpan
      onVote(selectedCandidate)
      setSelectedCandidate(null)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Terjadi kesalahan'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Konfirmasi vote dinonaktifkan

  // Selected candidate detail tidak diperlukan lagi setelah konfirmasi dihapus
  // const selectedCandidateData = candidates.find(c => c.id.toString() === selectedCandidate)

  if (hasVoted) {
    const votedCandidate = candidates.find(c => c.id.toString() === votedFor)
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <IconCheck className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-green-600">Terima Kasih!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Anda telah berhasil memberikan suara untuk:
          </p>
          {votedCandidate && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{votedCandidate.name}</h3>
              <p className="text-gray-600">{votedCandidate.class}</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Hasil pemilihan akan diumumkan setelah periode voting selesai.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            showVoteButton={true}
            onVote={handleVoteClick}
          />
        ))}
      </div>

      {/* Form Data Pemilih */}
      {showVoterForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Data Pemilih</h3>
              <p className="text-gray-600 text-sm mt-1">Isi data Anda sebelum memilih kandidat.</p>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-gray-700">Nama Lengkap</label>
                <input
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Kelas</label>
                <input
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="Mis. XI RPL 1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@sekolah.sch.id"
                />
              </div>
              {formError && <div className="text-sm text-red-600">{formError}</div>}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowVoterForm(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <Button onClick={handleSubmitVoterForm} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Lanjutkan'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal konfirmasi dihilangkan karena vote diproses saat form disimpan */}
    </div>
  )
}

