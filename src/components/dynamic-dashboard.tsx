"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
import { useCandidates } from "@/hooks/use-candidates"
import { useVoters } from "@/hooks/use-voters"
import { useElectionSettings } from "@/hooks/use-election-settings"
import { useRole } from "@/contexts/RoleContext"
import {
  IconUsers,
  IconCheck,
  IconChartBar,
  IconUsersGroup,
  IconShieldCheck,
  IconEye,
  // IconDownload,
  IconLoader2
} from "@tabler/icons-react"

export function DynamicDashboard() {
  const { currentRole } = useRole()
  const { candidates, loading: candidatesLoading, error: candidatesError } = useCandidates()
  const { voters, loading: votersLoading, error: votersError } = useVoters()
  const { settings } = useElectionSettings()

  const loading = candidatesLoading || votersLoading
  const error = candidatesError || votersError

  const isActive = settings?.is_active ?? true

  const totalVotes = voters.filter(v => v.has_voted).length
  const candidateIdToVotes = new Map<number, number>()
  voters.forEach(v => {
    if (v.voted_for != null) {
      candidateIdToVotes.set(v.voted_for, (candidateIdToVotes.get(v.voted_for) || 0) + 1)
    }
  })
  const candidatesWithVotes = candidates.map(c => ({ ...c, votes: candidateIdToVotes.get(c.id) || 0 }))
  // remainingVoters was computed but not used; remove to avoid unused-var warning

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <IconLoader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded">
          Coba Lagi
        </button>
      </div>
    )
  }

  // Admin Dashboard Content
  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrator</h1>
          <p className="text-gray-600">Kelola pemilihan ketua OSIS secara menyeluruh</p>
        </div>
        <Badge className="bg-red-100 text-red-700">
          <IconShieldCheck className="h-3 w-3 mr-1" />
          Administrator
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Kandidat Terdaftar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidatesWithVotes
                .slice()
                .sort((a, b) => b.votes - a.votes)
                .map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-gray-600">{candidate.class}</p>
                  </div>
                  <Badge variant="outline">{candidate.votes} suara</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChartBar className="h-5 w-5" />
              Statistik Voting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Suara</span>
                <span className="font-semibold">{totalVotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Kandidat</span>
                <span className="font-semibold">{candidates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
                  <IconCheck className="h-3 w-3 mr-1" />
                  {isActive ? "Aktif" : "Selesai"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Panitia Dashboard Content
  const PanitiaDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Panitia</h1>
          <p className="text-gray-600">Pantau dan kelola proses pemilihan ketua OSIS</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          <IconUsersGroup className="h-3 w-3 mr-1" />
          Panitia
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Suara</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
            <p className="text-xs text-gray-500">suara terkumpul</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconEye className="h-5 w-5" />
              Monitoring Real-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status Pemilihan</span>
                <Badge className={isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
                  <IconCheck className="h-3 w-3 mr-1" />
                  {isActive ? "Berlangsung" : "Selesai"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )

  // Member Dashboard Content
  const MemberDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Member</h1>
          <p className="text-gray-600">Selamat datang di sistem pemilihan ketua OSIS</p>
        </div>
        <Badge className="bg-green-100 text-green-700">
          <IconUsers className="h-3 w-3 mr-1" />
          Member
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kandidat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
            <p className="text-xs text-gray-500">kandidat tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Suara</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
            <p className="text-xs text-gray-500">suara terkumpul</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCheck className="h-5 w-5" />
              Informasi Voting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className={isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
                  <IconCheck className="h-3 w-3 mr-1" />
                  {isActive ? "Aktif" : "Selesai"}
                </Badge>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Render dashboard based on current role
  switch (currentRole) {
    case 'admin':
      return <AdminDashboard />
    case 'panitia':
      return <PanitiaDashboard />
    case 'member':
      return <MemberDashboard />
    default:
      return <MemberDashboard />
  }
}
