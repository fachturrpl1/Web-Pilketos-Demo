# Setup Supabase untuk Aplikasi Pemilihan OSIS

## 1. Buat Project Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Buat akun atau login
3. Klik "New Project"
4. Pilih organization dan isi detail project:
   - Name: `pemilihan-osis`
   - Database Password: (buat password yang kuat)
   - Region: pilih yang terdekat (Singapore untuk Indonesia)

## 2. Dapatkan Credentials

Setelah project dibuat, pergi ke **Settings > API**:

1. **Project URL**: Copy URL project (contoh: `https://your-project-id.supabase.co`)
2. **anon public key**: Copy anon key

## 3. Setup Environment Variables

Buat file `.env.local` di root project dengan isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Setup Database Schema

Jalankan SQL berikut di **SQL Editor** di Supabase Dashboard:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create candidates table
CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50) NOT NULL,
  photo_url TEXT,
  vision TEXT NOT NULL,
  mission TEXT[] NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voters table
CREATE TABLE voters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  class VARCHAR(50) NOT NULL,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  voted_for INTEGER REFERENCES candidates(id),
  voted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create election_settings table
CREATE TABLE election_settings (
  id SERIAL PRIMARY KEY,
  election_name VARCHAR(255) DEFAULT 'Pemilihan Ketua OSIS',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  max_votes_per_voter INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to increment votes
CREATE OR REPLACE FUNCTION increment_votes(candidate_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE candidates 
  SET votes = votes + 1, updated_at = NOW()
  WHERE id = candidate_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default election settings
INSERT INTO election_settings (election_name, start_date, end_date, is_active) 
VALUES (
  'Pemilihan Ketua OSIS 2024',
  NOW(),
  NOW() + INTERVAL '7 days',
  TRUE
);

-- Enable Row Level Security (RLS)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to candidates" ON candidates FOR SELECT USING (true);
CREATE POLICY "Allow public read access to voters" ON voters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to election_settings" ON election_settings FOR SELECT USING (true);

-- Allow insert/update for candidates (adjust based on your auth requirements)
CREATE POLICY "Allow insert candidates" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update candidates" ON candidates FOR UPDATE USING (true);
CREATE POLICY "Allow delete candidates" ON candidates FOR DELETE USING (true);

-- Allow insert/update for voters
CREATE POLICY "Allow insert voters" ON voters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update voters" ON voters FOR UPDATE USING (true);
CREATE POLICY "Allow delete voters" ON voters FOR DELETE USING (true);

-- Allow update for election settings
CREATE POLICY "Allow update election_settings" ON election_settings FOR UPDATE USING (true);
```

## 5. Test Connection

Setelah setup selesai, jalankan aplikasi:

```bash
npm run dev
```

Buka browser dan coba:
1. Tambah kandidat baru
2. Lihat data kandidat
3. Edit kandidat
4. Hapus kandidat

Data akan tersimpan di Supabase dan dapat dilihat di **Table Editor** di dashboard Supabase.

## 6. Monitoring

- **Table Editor**: Lihat data di database
- **Logs**: Monitor aktivitas di **Logs** section
- **API**: Test API calls di **API** section

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan file `.env.local` sudah dibuat dengan benar
- Restart development server setelah menambah environment variables

### Error: "Failed to fetch candidates"
- Periksa apakah tabel sudah dibuat dengan benar
- Pastikan RLS policies sudah dikonfigurasi
- Cek network tab di browser untuk error details

### Error: "Permission denied"
- Periksa RLS policies di Supabase
- Pastikan anon key memiliki permission yang cukup


















