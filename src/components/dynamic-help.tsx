"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRole } from "@/contexts/RoleContext"
import {
  IconUsers,
  IconCheck,
  IconTrophy,
  IconClock,
  IconFileText,
  IconShieldCheck,
  IconUsersGroup,
  IconEye,
  IconSettings
} from "@tabler/icons-react"

export function DynamicHelp() {
  const { currentRole } = useRole()

  // Admin Help Content
  const AdminHelp = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bantuan Administrator</h1>
          <p className="text-gray-600">Panduan lengkap untuk mengelola sistem pemilihan ketua OSIS</p>
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
              Kelola Kandidat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Menambah Kandidat Baru</h4>
              <p className="text-sm text-gray-600">
                1. Klik menu Kelola Kandidat<br/>
                2. Klik tombol Tambah Kandidat<br/>
                3. Isi data lengkap kandidat<br/>
                4. Upload foto profil<br/>
                5. Klik Simpan
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Mengedit Kandidat</h4>
              <p className="text-sm text-gray-600">
                1. Pilih kandidat yang akan diedit<br/>
                2. Klik tombol &quot;Edit&quot;<br/>
                3. Ubah data yang diperlukan<br/>
                4. Klik &quot;Update&quot;
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kelola Pemilih card removed as requested */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSettings className="h-5 w-5" />
              Pengaturan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Periode & Status Voting</h4>
              <p className="text-sm text-gray-600">
                1. Buka menu &quot;Pengaturan&quot;<br/>
                2. Atur tanggal mulai & selesai voting<br/>
                3. Ubah status: Aktifkan Pemilihan, Izinkan Voting, Izinkan Registrasi Kandidat<br/>
                4. Klik &quot;Simpan Pengaturan&quot;
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Hasil Pemilihan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Melihat Hasil</h4>
              <p className="text-sm text-gray-600">
                1. Buka menu &quot;Hasil Pemilihan&quot;<br/>
                2. Lihat total suara dan kandidat terdaftar<br/>
                3. Tinjau peringkat & perolehan suara per kandidat<br/>
                4. Gunakan grafik untuk visualisasi hasil
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Kontak Dukungan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Teknis</h4>
              <p className="text-sm text-gray-600">
                Email: admin@osis-school.edu<br/>
                Phone: (021) 1234-5678<br/>
                Jam: Senin-Jumat 08:00-17:00
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Darurat</h4>
              <p className="text-sm text-gray-600">
                Email: emergency@osis-school.edu<br/>
                Phone: (021) 1234-9999<br/>
                Available 24/7
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )

  // Panitia Help Content
  const PanitiaHelp = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bantuan Panitia</h1>
          <p className="text-gray-600">Panduan untuk memantau dan mengelola proses pemilihan ketua OSIS</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          <IconUsersGroup className="h-3 w-3 mr-1" />
          Panitia
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="h-5 w-5" />
              Hasil Pemilihan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Melihat Hasil</h4>
              <p className="text-sm text-gray-600">
                1. Buka menu &quot;Hasil Pemilihan&quot;<br/>
                2. Lihat total suara (dari voters) & kandidat terdaftar<br/>
                3. Tinjau peringkat & perolehan suara per kandidat<br/>
                4. Gunakan grafik untuk visualisasi hasil
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconEye className="h-5 w-5" />
              Manajemen Kandidat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Verifikasi & Edit Data Kandidat</h4>
              <p className="text-sm text-gray-600">
                1. Periksa profil & foto kandidat<br/>
                2. Tambah/Edit/Hapus kandidat sesuai kebutuhan<br/>
                3. Pastikan misi/visi tampil rapi (tanpa []), perbaiki jika perlu
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Daftar Pemilih
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Kelola & Verifikasi Pemilih</h4>
              <p className="text-sm text-gray-600">
                1. Tambah/Edit/Hapus data pemilih<br/>
                2. Periksa kelengkapan & validitas data<br/>
                3. Pantau status has_voted & pilihan kandidat
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Member Help Content
  const MemberHelp = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bantuan Member</h1>
          <p className="text-gray-600">Panduan untuk berpartisipasi dalam pemilihan ketua OSIS</p>
        </div>
        <Badge className="bg-green-100 text-green-700">
          <IconUsers className="h-3 w-3 mr-1" />
          Member
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Profil Kandidat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Cara Melihat Profil Kandidat</h4>
              <p className="text-sm text-gray-600">
                1. Klik menu &quot;Profil Kandidat&quot;<br/>
                2. Pilih kandidat yang ingin dilihat<br/>
                3. Baca visi dan misi<br/>
                4. Lihat pengalaman dan prestasi
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Informasi yang Tersedia</h4>
              <p className="text-sm text-gray-600">
                - Foto profil kandidat<br/>
                - Visi dan misi<br/>
                - Program kerja
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCheck className="h-5 w-5" />
              Proses Voting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Cara Memberikan Suara</h4>
              <p className="text-sm text-gray-600">
                1. Login ke sistem<br/>
                2. Klik menu &quot;Voting&quot;<br/>
                3. Pilih kandidat favorit<br/>
                4. Konfirmasi pilihan<br/>
                5. Submit suara
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Tips Voting</h4>
              <p className="text-sm text-gray-600">
                - Baca profil semua kandidat<br/>
                - Pertimbangkan visi dan misi<br/>
                - Pastikan koneksi internet stabil<br/>
                - Jangan lupa logout setelah voting
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTrophy className="h-5 w-5" />
              Hasil Pemilihan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Melihat Hasil</h4>
              <p className="text-sm text-gray-600">
                1. Klik menu &quot;Hasil&quot;<br/>
                2. Lihat peringkat kandidat<br/>
                3. Periksa jumlah suara & persentase
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Informasi Hasil</h4>
              <p className="text-sm text-gray-600">
                - Peringkat kandidat<br/>
                - Jumlah suara per kandidat<br/>
                - Persentase dari total suara
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Catatan</h4>
              <p className="text-sm text-gray-600">
                - Hasil akan ditampilkan setelah voting selesai<br/>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Render help content based on current role
  switch (currentRole) {
    case 'admin':
      return <AdminHelp />
    case 'panitia':
      return <PanitiaHelp />
    case 'member':
      return <MemberHelp />
    default:
      return <MemberHelp />
  }
}
