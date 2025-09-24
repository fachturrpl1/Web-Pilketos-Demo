"use client"

import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useState, useEffect } from "react"
import { Candidate } from "@/types/database"
import { PhotoUpload } from "@/components/photo-upload"
import Image from "next/image"

export default function PanitiaCandidates() {
  const { candidates, loading, error, addCandidate, editCandidate, removeCandidate, refetch } = useCandidates()
  const { voters } = useVoters()
  const { settings } = useElectionSettings()
  const allowRegistration = settings?.allow_registration ?? true
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Map votes from voters.voted_for
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

  // Debug: Log data untuk debugging
  useEffect(() => {
    console.log('Candidates state updated:', candidates)
    console.log('Filtered candidates:', filteredCandidates)
    console.log('Search term:', searchTerm)
  }, [candidates, filteredCandidates, searchTerm])

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
        // Refresh data dari database
        await refetch()
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
        
        // Debug: Cek apakah ada perubahan data
        const currentCandidate = candidates.find(c => c.id === editingCandidate.id)
        console.log('Current candidate data:', currentCandidate)
        console.log('Updated candidate data:', updatedCandidate)
        
        const result = await editCandidate(editingCandidate.id, updatedCandidate)
        console.log('Edit result:', result)
        if (result.success) {
    setEditingCandidate(null)
          alert('Kandidat berhasil diupdate!')
          // Refresh data dari database
          await refetch()
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
        console.log('Deleting candidate:', candidateId)
        const result = await removeCandidate(candidateId)
        console.log('Delete result:', result)
        if (result.success) {
          alert('Kandidat berhasil dihapus!')
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error('Delete candidate error:', error)
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Kandidat</h1>
          <p className="text-gray-600">Kelola data kandidat ketua OSIS</p>
        </div>
        <div className="flex gap-2">
          
          <Button 
            onClick={async () => {
              if (candidates.length > 0) {
                const testCandidate = candidates[0]
                console.log('Testing edit with candidate:', testCandidate)
                const result = await editCandidate(testCandidate.id, {
                  name: testCandidate.name + ' (Updated)',
                  class: testCandidate.class,
                  photo_url: testCandidate.photo_url,
                  vision: testCandidate.vision,
                  mission: testCandidate.mission
                })
                console.log('Test edit result:', result)
                alert(result.success ? 'Test edit berhasil!' : `Error: ${result.error}`)
              } else {
                alert('Tidak ada kandidat untuk ditest')
              }
            }}
            variant="outline"
            disabled={isSubmitting || candidates.length === 0}
          >
            Test Edit
          </Button>
          
          <Button onClick={() => setIsAddDialogOpen(true)} disabled={isSubmitting || !allowRegistration}>
          <IconPlus className="h-4 w-4 mr-2" />
          Tambah Kandidat
        </Button>
      </div>
      </div>

      {!allowRegistration && (
        <Card>
          <CardContent className="p-4 text-amber-800 text-sm">
            Registrasi kandidat saat ini ditutup. Anda tidak dapat menambahkan kandidat baru.
          </CardContent>
        </Card>
      )}

      {/* Search (same UI as admin) */}
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

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                    {candidate.photo_url ? (
                      <Image
                        src={candidate.photo_url}
                        alt={candidate.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full bg-blue-100 flex items-center justify-center"><svg class="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule=\"evenodd\" d=\"M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z\" clip-rule=\"evenodd\"></path></svg></div>'
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <IconUser className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{candidate.votes}</div>
                  <div className="text-xs text-gray-500">suara</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                {candidate.vision}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setViewingCandidate(candidate)}
                >
                  <IconEye className="h-4 w-4 mr-1" />
                  Lihat
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
            </CardContent>
          </Card>
        ))}
      </div>

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

      {/* View Detail Modal */}
      {viewingCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-200">
                    {viewingCandidate.photo_url ? (
                      <Image
                        src={viewingCandidate.photo_url}
                        alt={viewingCandidate.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full bg-blue-100 flex items-center justify-center"><svg class="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule=\"evenodd\" d=\"M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z\" clip-rule=\"evenodd\"></path></svg></div>'
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <IconUser className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{viewingCandidate.name}</h2>
                    <p className="text-gray-600">{viewingCandidate.class}</p>
                  </div>
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

  // Reset form when candidate changes
  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || "",
        class: candidate.class || "",
        photo_url: candidate.photo_url || "",
        vision: candidate.vision || "",
        mission: candidate.mission || [],
        created_at: candidate.created_at || new Date().toISOString(),
        update_at: candidate.update_at || new Date().toISOString()
      })
    } else {
      setFormData({
        name: "",
        class: "",
        photo_url: "",
        vision: "",
        mission: [],
        created_at: new Date().toISOString(),
        update_at: new Date().toISOString()
      })
    }
  }, [candidate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prepare data for Supabase
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
            'Simpan'
          )}
        </Button>
      </div>
    </form>
  )
}

