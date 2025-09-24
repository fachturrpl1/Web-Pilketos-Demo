"use client"

import { PageLayout } from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVoters } from "@/hooks/use-voters"
import { useCandidates } from "@/hooks/use-candidates"
import { 
  IconSearch, 
  IconCheck, 
  IconClock,
  IconUser,
  IconPencil,
  IconTrash,
  IconLoader2
} from "@tabler/icons-react"
import { useState } from "react"
import { Voter } from "@/types/database"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminVoters() {
  const { voters, loading: votersLoading, error: votersError, addVoter, editVoter, removeVoter } = useVoters()
  const { candidates } = useCandidates()
  const [searchTerm, setSearchTerm] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState<5 | 10 | "all">(5)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null)

  const filteredVoters = voters.filter(voter => {
    const matchesSearch = voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voter.class.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const displayedVoters = itemsPerPage === "all" 
    ? filteredVoters 
    : filteredVoters.slice(0, itemsPerPage)

  const getVotedCandidateName = (candidateId?: number) => {
    if (!candidateId) return "-"
    const candidate = candidates.find(c => c.id === candidateId)
    return candidate ? candidate.name : "-"
  }

  const handleEditVoter = async (updated: Omit<Voter, 'id'>) => {
    if (!editingVoter) return
    setIsSubmitting(true)
    try {
      const result = await editVoter(editingVoter.id, updated)
      if (result.success) {
        setEditingVoter(null)
        alert('Pemilih berhasil diupdate!')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch {
      alert('Terjadi kesalahan saat mengupdate pemilih')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddVoter = async (newVoter: Omit<Voter, 'id'>) => {
    setIsSubmitting(true)
    try {
      const result = await addVoter(newVoter)
      if (result.success) {
        setIsAddDialogOpen(false)
        alert('Pemilih berhasil ditambahkan!')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch {
      alert('Terjadi kesalahan saat menambah pemilih')
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleDeleteVoter = async (voterId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pemilih ini?")) {
      setIsSubmitting(true)
      try {
        const result = await removeVoter(voterId)
        if (!result.success) {
          alert(`Error: ${result.error}`)
        } else {
          alert('Pemilih berhasil dihapus!')
        }
      } catch {
        alert('Terjadi kesalahan saat menghapus pemilih')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  

  if (votersLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat data pemilih...</span>
        </div>
      </PageLayout>
    )
  }

  if (votersError) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {votersError}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Pemilih</h1>
          <p className="text-gray-600">Kelola daftar pemilih</p>
        </div>
        <div className="flex gap-2"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama atau kelas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tampilkan:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(value === "all" ? "all" : parseInt(value) as 5 | 10)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 data</SelectItem>
              <SelectItem value="10">10 data</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Daftar Pemilih ({displayedVoters.length} dari {filteredVoters.length})</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">No</th>
                  <th className="text-left p-3 font-medium">Nama</th>
                  <th className="text-left p-3 font-medium">Kelas</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Pilihan</th>
                  <th className="text-left p-3 font-medium">Waktu Voting</th>
                  <th className="text-left p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedVoters.map((voter, index) => (
                  <tr key={voter.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{index + 1}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <IconUser className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium">{voter.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{voter.class}</td>
                    <td className="p-3">
                      {voter.has_voted ? (
                        <Badge className="bg-green-100 text-green-700">
                          <IconCheck className="h-3 w-3 mr-1" />
                          Sudah Memilih
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          <IconClock className="h-3 w-3 mr-1" />
                          Belum Memilih
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-gray-600">
                      {voter.has_voted ? getVotedCandidateName(voter.voted_for || undefined) : "-"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {voter.voted_at ? new Date(voter.voted_at).toLocaleString() : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => setEditingVoter(voter)}>
                          <IconPencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteVoter(voter.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={isSubmitting}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Voter Modal */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Tambah Pemilih Baru</h2>
            <VoterForm 
              onSubmit={handleAddVoter}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Voter Modal */}
      {editingVoter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Pemilih</h2>
            <VoterForm 
              voter={editingVoter}
              onSubmit={handleEditVoter}
              onCancel={() => setEditingVoter(null)}
            />
          </div>
        </div>
      )}
      </div>
    </PageLayout>
  )
}

interface VoterFormProps {
  voter?: Voter
  onSubmit: (voter: Omit<Voter, 'id'>) => void
  onCancel: () => void
}

function VoterForm({ voter, onSubmit, onCancel }: VoterFormProps) {
  const [formData, setFormData] = useState<Omit<Voter, 'id'>>({
    name: voter?.name || "",
    email: voter?.email || "",
    class: voter?.class || "",
    has_voted: voter?.has_voted || false,
    voted_for: voter?.voted_for || null,
    voted_at: voter?.voted_at || null,
    created_at: voter?.created_at || new Date().toISOString(),
    update_at: voter?.update_at || new Date().toISOString()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
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

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          {voter ? "Update" : "Tambah"} Pemilih
        </Button>
      </div>
    </form>
  )
}

