"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageLayout } from "@/components/page-layout"
import { useCandidates } from "@/hooks/use-candidates"
import { useVoters } from "@/hooks/use-voters"
import { useElectionSettings } from "@/hooks/use-election-settings"
import { 
  IconPlus, 
  IconPencil, 
  IconTrash,
  IconUser,
  IconEye,
  IconLoader2,
  IconSearch
} from "@tabler/icons-react"
import { useState } from "react"
import { Candidate } from "@/types/database"
import { PhotoUpload } from "@/components/photo-upload"
import Image from "next/image"

export default function AdminCandidates() {
  const { candidates, loading, error, addCandidate, editCandidate, removeCandidate } = useCandidates()
  const { voters } = useVoters()
  const { settings } = useElectionSettings()
  const allowRegistration = settings?.allow_registration ?? true
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Build live votes per candidate from voters table
  const votesMap = new Map<number, number>()
  voters?.forEach(v => {
    if (v.voted_for != null) {
      votesMap.set(v.voted_for, (votesMap.get(v.voted_for) || 0) + 1)
    }
  })

  const candidatesWithVotes = candidates.map(c => ({ ...c, votes: votesMap.get(c.id) || 0 }))

  const filteredCandidates = candidatesWithVotes.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.class.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCandidate = async (newCandidate: Omit<Candidate, 'id' | 'votes'>) => {
    if (!allowRegistration) {
      alert('Registrasi kandidat ditutup. Tidak dapat menambah kandidat baru.')
      return
    }
    setIsSubmitting(true)
    try {
      console.log('Adding candidate:', newCandidate)
      const result = await addCandidate(newCandidate)
      console.log('Add result:', result)
      if (result.success) {
        setIsAddDialogOpen(false)
        alert('Kandidat berhasil ditambahkan!')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Add candidate error:', error)
      alert('Terjadi kesalahan saat menambah kandidat')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCandidate = async (updatedCandidate: Omit<Candidate, 'id' | 'votes'> | Candidate) => {
    console.log('handleEditCandidate called with:', updatedCandidate)
    console.log('editingCandidate state:', editingCandidate)
    
    if (editingCandidate && editingCandidate.id) {
      setIsSubmitting(true)
      try {
        console.log('Editing candidate:', updatedCandidate)
        console.log('Candidate ID:', editingCandidate.id)
        const result = await editCandidate(editingCandidate.id, updatedCandidate)
        console.log('Edit result:', result)
        if (result.success) {
    setEditingCandidate(null)
          alert('Kandidat berhasil diupdate!')
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error('Edit candidate error:', error)
        alert('Terjadi kesalahan saat mengupdate kandidat')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      console.error('No editing candidate or ID found')
      alert('Error: Tidak ada kandidat yang sedang diedit')
    }
  }

  const handleDeleteCandidate = async (candidateId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kandidat ini?")) {
      setIsSubmitting(true)
      try {
        const result = await removeCandidate(candidateId)
        if (!result.success) {
          alert(`Error: ${result.error}`)
        }
      } catch {
        alert('Terjadi kesalahan saat menghapus kandidat')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  

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
          <Button onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Kandidat</h1>
          <p className="text-gray-600">Kelola data kandidat ketua OSIS dengan fitur lengkap</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)} disabled={isSubmitting || !allowRegistration}>
                <IconPlus className="h-4 w-4 mr-2" />
                Tambah Kandidat
              </Button>
        </div>
      </div>

      {/* Info when registration closed */}
      {!allowRegistration && (
        <Card>
          <CardContent className="p-4 text-amber-800 text-sm">
            Registrasi kandidat saat ini ditutup. Anda tidak dapat menambahkan kandidat baru.
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Kandidat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Suara</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {voters.filter(v => v.has_voted).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kandidat Teratas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {candidatesWithVotes.length > 0 ? candidatesWithVotes.reduce((prev, current) => prev.votes > current.votes ? prev : current).name : '-'}
            </div>
          </CardContent>
        </Card>

        {/* Rata-rata Suara card removed as requested */}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama atau kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kandidat ({filteredCandidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">No</th>
                  <th className="text-left p-3 font-medium">Nama</th>
                  <th className="text-left p-3 font-medium">Kelas</th>
                  <th className="text-left p-3 font-medium">Suara</th>
                  <th className="text-left p-3 font-medium">Persentase</th>
                  <th className="text-left p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate, index) => {
                  const totalVotes = voters.filter(v => v.has_voted).length
                  const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0'
                  
                  return (
                    <tr key={candidate.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{index + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                            {candidate.photo_url ? (
                              <Image
                                src={candidate.photo_url}
                                alt={candidate.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full bg-gray-100 flex items-center justify-center"><svg class="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>'
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <IconUser className="h-4 w-4 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{candidate.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{candidate.class}</td>
                      <td className="p-3">
                        <span className="font-medium text-blue-600">{candidate.votes}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{percentage}%</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setViewingCandidate(candidate)}
                          >
                            <IconEye className="h-4 w-4" />
                              </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingCandidate(candidate)}
                          >
                            <IconPencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCandidate(candidate.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={isSubmitting}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Detail Modal */}
      {viewingCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{viewingCandidate.name}</h2>
                  <p className="text-gray-600">{viewingCandidate.class}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setViewingCandidate(null)}
                  className="rounded-full w-8 h-8 p-0"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-blue-600 mb-2">Visi</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{viewingCandidate.vision}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-blue-600 mb-2">Misi</h3>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {Array.isArray(viewingCandidate.mission) 
                      ? viewingCandidate.mission.map((item, index) => (
                          <div key={index} className="mb-1">
                            {index + 1}. {item}
                          </div>
                        ))
                      : viewingCandidate.mission
                    }
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Suara</span>
                    <span className="text-lg font-bold text-blue-600">{viewingCandidate.votes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddDialogOpen && allowRegistration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Tambah Kandidat Baru</h2>
            </div>
            <div className="p-6">
              <CandidateForm 
                onSubmit={handleAddCandidate}
                onCancel={() => setIsAddDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Kandidat</h2>
            </div>
            <div className="p-6">
            <CandidateForm 
              candidate={editingCandidate}
              onSubmit={handleEditCandidate}
              onCancel={() => setEditingCandidate(null)}
                isSubmitting={isSubmitting}
            />
            </div>
          </div>
        </div>
      )}
    </div>
    </PageLayout>
  )
}

interface CandidateFormProps {
  candidate?: Candidate
  onSubmit: (candidate: Omit<Candidate, 'id' | 'votes'> | Candidate) => void
  onCancel: () => void
  isSubmitting?: boolean
}

function CandidateForm({ candidate, onSubmit, onCancel, isSubmitting = false }: CandidateFormProps) {
  const [formData, setFormData] = useState({
    name: candidate?.name || "",
    class: candidate?.class || "",
    photo_url: candidate?.photo_url || "",
    vision: candidate?.vision || "",
    mission: candidate?.mission || [],
    created_at: candidate?.created_at || new Date().toISOString(),
    update_at: candidate?.update_at || new Date().toISOString()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const candidateData = {
      name: formData.name,
      class: formData.class,
      photo_url: formData.photo_url,
      vision: formData.vision,
      mission: formData.mission,
      created_at: formData.created_at,
      update_at: formData.update_at
    }
    try {
      await onSubmit(candidateData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="class" className="text-sm font-medium text-gray-700">Kelas</Label>
          <Input
            id="class"
            value={formData.class}
            onChange={(e) => setFormData({...formData, class: e.target.value})}
            required
            className="w-full"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Foto Kandidat</Label>
        <PhotoUpload
          value={formData.photo_url}
          onChange={(url) => setFormData({...formData, photo_url: url})}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vision" className="text-sm font-medium text-gray-700">Visi</Label>
        <Textarea
          id="vision"
          value={formData.vision}
          onChange={(e) => setFormData({...formData, vision: e.target.value})}
          rows={3}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mission" className="text-sm font-medium text-gray-700">Misi (satu per baris)</Label>
        <Textarea
          id="mission"
          value={Array.isArray(formData.mission) ? formData.mission.join('\n') : formData.mission}
          onChange={(e) => setFormData({...formData, mission: e.target.value.split('\n').filter(line => line.trim())})}
          rows={4}
          required
          className="w-full"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            candidate ? "Update" : "Tambah"
          )}
        </Button>
      </div>
    </form>
  )
}

