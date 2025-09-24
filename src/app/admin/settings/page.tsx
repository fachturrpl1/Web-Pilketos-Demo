"use client"

import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  IconSettings, 
  IconShieldCheck,
  IconLoader2
} from "@tabler/icons-react"
import { useElectionSettings } from "@/hooks/use-election-settings"

export default function AdminSettings() {
  const { settings, loading, error, updateSettings, refetch } = useElectionSettings()

  const handleSaveSettings = () => {
    alert("Pengaturan berhasil disimpan!")
  }

  // Import/Export removed per request

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <IconLoader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat pengaturan...</span>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={refetch}>Coba Lagi</Button>
        </div>
      </PageLayout>
    )
  }

  const isActive = settings?.is_active ?? false
  const allowVoting = settings?.allow_voting ?? false
  const allowRegistration = settings?.allow_registration ?? false

  return (
    <PageLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Sistem</h1>
          <p className="text-gray-600">Konfigurasi sistem pemilihan ketua OSIS</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveSettings}>
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconShieldCheck className="h-5 w-5" />
            Status Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Pemilihan Aktif</span>
                <Badge className={isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {isActive ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Voting Diizinkan</span>
                <Badge className={allowVoting ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {allowVoting ? "Ya" : "Tidak"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Registrasi Kandidat</span>
                <Badge className={allowRegistration ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                  {allowRegistration ? "Dibuka" : "Ditutup"}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Database</span>
                <Badge className="bg-green-100 text-green-700">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Keamanan</span>
                <Badge className="bg-green-100 text-green-700">Aman</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Backup Terakhir</span>
                <Badge className="bg-blue-100 text-blue-700">2 jam lalu</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSettings className="h-5 w-5" />
            Kontrol Sistem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Aktifkan Pemilihan</Label>
              <p className="text-sm text-gray-600">Mengaktifkan atau menonaktifkan sistem pemilihan</p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={async (checked: boolean) => {
                await updateSettings({ is_active: checked })
                await refetch()
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowVoting">Izinkan Voting</Label>
              <p className="text-sm text-gray-600">Mengizinkan pemilih untuk memberikan suara</p>
            </div>
            <Switch
              id="allowVoting"
              checked={allowVoting}
              onCheckedChange={async (checked: boolean) => {
                await updateSettings({ allow_voting: checked })
                await refetch()
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowRegistration">Izinkan Registrasi Kandidat</Label>
              <p className="text-sm text-gray-600">Mengizinkan pendaftaran kandidat baru</p>
            </div>
            <Switch
              id="allowRegistration"
              checked={allowRegistration}
              onCheckedChange={async (checked: boolean) => {
                await updateSettings({ allow_registration: checked })
                await refetch()
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Announcements and Danger Zone removed as requested */}
      </div>
    </PageLayout>
  )
}

