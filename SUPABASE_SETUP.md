# Setup Supabase untuk Sistem Pemilihan OSIS

## 1. Persiapan Supabase

### Buat Project Supabase
1. Kunjungi [supabase.com](https://supabase.com)
2. Login atau daftar akun
3. Klik "New Project"
4. Pilih organization dan isi detail project:
   - Name: `osis-election-system`
   - Database Password: (buat password yang kuat)
   - Region: pilih yang terdekat (Singapore untuk Indonesia)

### Dapatkan Credentials
1. Setelah project dibuat, buka **Settings** > **API**
2. Copy **Project URL** dan **anon public** key
3. Buat file `.env.local` di root project dengan isi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2. Setup Database Schema

### Jalankan SQL Schema
1. Buka **SQL Editor** di dashboard Supabase
2. Copy seluruh isi file `supabase-schema.sql`
3. Paste dan jalankan query tersebut
4. Pastikan semua tabel, fungsi, dan policy berhasil dibuat

### Verifikasi Tabel
Pastikan tabel berikut telah dibuat:
- `users` - Data pengguna sistem
- `election_settings` - Pengaturan pemilihan
- `candidates` - Data kandidat
- `voters` - Data pemilih

## 3. Setup Authentication

### Enable Email Auth
1. Buka **Authentication** > **Settings**
2. Pastikan **Enable email confirmations** aktif
3. Atur **Site URL** ke `http://localhost:3000` (untuk development)
4. Atur **Redirect URLs** sesuai kebutuhan

### Setup Email Templates (Opsional)
1. Buka **Authentication** > **Email Templates**
2. Customize template untuk:
   - Confirm signup
   - Reset password
   - Magic link

## 4. Testing

### Test Database Connection
1. Jalankan aplikasi: `npm run dev`
2. Buka browser ke `http://localhost:3000`
3. Coba login dengan akun sample:
   - Email: `admin@osis.com`
   - Password: (buat password di Supabase Auth)

### Test CRUD Operations
1. Login sebagai admin
2. Coba tambah/edit/hapus kandidat
3. Coba tambah/edit/hapus pemilih
4. Verifikasi data tersimpan di database

## 5. Production Setup

### Environment Variables
Untuk production, update environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### Security Settings
1. Update **Site URL** di Supabase ke domain production
2. Update **Redirect URLs** sesuai domain production
3. Review dan update Row Level Security policies jika diperlukan

## 6. Troubleshooting

### Common Issues

#### Database Connection Error
- Pastikan environment variables sudah benar
- Cek apakah Supabase project masih aktif
- Verifikasi network connection

#### Authentication Error
- Pastikan email confirmation sudah diatur
- Cek email templates
- Verifikasi redirect URLs

#### Permission Denied
- Cek Row Level Security policies
- Pastikan user sudah login
- Verifikasi user role di database

### Debug Mode
Untuk debugging, tambahkan di `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

## 7. Backup & Maintenance

### Database Backup
1. Buka **Settings** > **Database**
2. Klik **Backup** untuk membuat backup manual
3. Atur **Automated backups** sesuai kebutuhan

### Monitoring
1. Monitor **Dashboard** untuk melihat usage
2. Cek **Logs** untuk error tracking
3. Review **API** usage dan limits

## 8. Support

Jika mengalami masalah:
1. Cek [Supabase Documentation](https://supabase.com/docs)
2. Join [Supabase Discord](https://discord.supabase.com)
3. Buka issue di GitHub repository


































