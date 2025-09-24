# Setup Environment Variables

Untuk menampilkan data voters dari Supabase, Anda perlu membuat file `.env.local` di root project dengan konfigurasi berikut:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Langkah-langkah:

1. **Buat file `.env.local`** di root project (sama level dengan `package.json`)
2. **Isi dengan credentials Supabase Anda:**
   - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anonymous key dari Supabase

3. **Restart development server:**
   ```bash
   npm run dev
   ```

## Cara mendapatkan Supabase credentials:

1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Pergi ke Settings > API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Verifikasi:

Setelah setup, data voters akan otomatis ditampilkan di:
- `/admin/voters` - Halaman admin untuk kelola voters
- `/panitia/voters` - Halaman panitia untuk lihat voters

## Troubleshooting:

Jika data tidak muncul:
1. Pastikan tabel `voters` sudah ada di Supabase
2. Pastikan RLS (Row Level Security) sudah dikonfigurasi
3. Check browser console untuk error messages
4. Pastikan environment variables sudah benar
























