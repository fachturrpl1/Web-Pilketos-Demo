-- Supabase Database Schema for OSIS Election System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'panitia', 'member');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create election_settings table
CREATE TABLE election_settings (
    id SERIAL PRIMARY KEY,
    election_name VARCHAR(255) NOT NULL DEFAULT 'Pemilihan Ketua OSIS',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    allow_voting BOOLEAN DEFAULT true,
    allow_registration BOOLEAN DEFAULT true,
    max_candidates INTEGER DEFAULT 10,
    require_photo BOOLEAN DEFAULT false,
    announcement TEXT,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    has_voted BOOLEAN DEFAULT false,
    voted_for INTEGER REFERENCES candidates(id) ON DELETE SET NULL,
    voted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_election_settings_updated_at BEFORE UPDATE ON election_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voters_updated_at BEFORE UPDATE ON voters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to increment candidate votes
CREATE OR REPLACE FUNCTION increment_votes(candidate_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE candidates 
    SET votes = votes + 1, updated_at = NOW()
    WHERE id = candidate_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement candidate votes
CREATE OR REPLACE FUNCTION decrement_votes(candidate_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE candidates 
    SET votes = GREATEST(votes - 1, 0), updated_at = NOW()
    WHERE id = candidate_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default election settings
INSERT INTO election_settings (
    election_name,
    start_date,
    end_date,
    is_active,
    allow_voting,
    allow_registration,
    max_candidates,
    require_photo,
    announcement,
    contact_info
) VALUES (
    'Pemilihan Ketua OSIS 2024',
    '2024-01-15 08:00:00+07',
    '2024-01-20 17:00:00+07',
    true,
    true,
    true,
    10,
    false,
    'Pemilihan Ketua OSIS akan dilaksanakan pada tanggal 15-20 Januari 2024. Pastikan untuk menggunakan hak pilih Anda dengan bijak.',
    'Kontak: osis@sekolah.com | Telp: (021) 123-4567'
);

-- Insert sample candidates
INSERT INTO candidates (name, class, photo_url, vision, mission) VALUES
(
    'Ahmad Rizki Pratama',
    'XII IPA 1',
    '/avatars/candidate1.jpg',
    'Mewujudkan OSIS yang inovatif, kreatif, dan berprestasi untuk kemajuan sekolah',
    ARRAY[
        'Meningkatkan kualitas kegiatan ekstrakurikuler',
        'Mengembangkan program literasi digital',
        'Memperkuat solidaritas antar siswa',
        'Menciptakan lingkungan belajar yang kondusif'
    ]
),
(
    'Siti Nurhaliza',
    'XII IPS 2',
    '/avatars/candidate2.jpg',
    'OSIS yang solid, progresif, dan berkarakter untuk masa depan yang gemilang',
    ARRAY[
        'Mengoptimalkan peran OSIS dalam kegiatan sekolah',
        'Meningkatkan partisipasi siswa dalam berbagai kegiatan',
        'Mengembangkan bakat dan minat siswa',
        'Menjalin komunikasi yang baik dengan pihak sekolah'
    ]
),
(
    'Muhammad Fauzi',
    'XII IPA 3',
    '/avatars/candidate3.jpg',
    'Membangun OSIS yang berintegritas, berprestasi, dan bermanfaat bagi semua',
    ARRAY[
        'Menciptakan program yang inovatif dan bermanfaat',
        'Meningkatkan kualitas kepemimpinan siswa',
        'Mengembangkan potensi siswa di berbagai bidang',
        'Memperkuat hubungan dengan alumni'
    ]
);

-- Insert sample voters
INSERT INTO voters (name, email, class, has_voted, voted_for, voted_at) VALUES
('Andi Wijaya', 'andi@email.com', 'XII IPA 1', true, 1, '2024-01-15 10:30:00+07'),
('Budi Santoso', 'budi@email.com', 'XII IPA 2', true, 2, '2024-01-15 11:15:00+07'),
('Citra Dewi', 'citra@email.com', 'XII IPS 1', false, NULL, NULL),
('Dedi Kurniawan', 'dedi@email.com', 'XII IPA 3', true, 3, '2024-01-15 14:20:00+07'),
('Eka Putri', 'eka@email.com', 'XII IPS 2', false, NULL, NULL),
('Fajar Nugroho', 'fajar@email.com', 'XII IPA 1', true, 1, '2024-01-15 15:45:00+07'),
('Gita Sari', 'gita@email.com', 'XII IPS 3', false, NULL, NULL),
('Hendra Pratama', 'hendra@email.com', 'XII IPA 2', true, 2, '2024-01-15 16:10:00+07'),
('Indira Lestari', 'indira@email.com', 'XII IPS 1', false, NULL, NULL),
('Joko Susilo', 'joko@email.com', 'XII IPA 3', true, 3, '2024-01-15 16:30:00+07');

-- Insert sample users
INSERT INTO users (email, name, role, avatar_url) VALUES
('admin@osis.com', 'Admin OSIS', 'admin', '/avatars/admin.jpg'),
('panitia@osis.com', 'Panitia OSIS', 'panitia', '/avatars/panitia.jpg'),
('member@osis.com', 'Siswa Member', 'member', '/avatars/member.jpg');

-- Create indexes for better performance
CREATE INDEX idx_candidates_votes ON candidates(votes DESC);
CREATE INDEX idx_voters_has_voted ON voters(has_voted);
CREATE INDEX idx_voters_class ON voters(class);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for election_settings table
CREATE POLICY "Anyone can view election settings" ON election_settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can update election settings" ON election_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Create policies for candidates table
CREATE POLICY "Anyone can view candidates" ON candidates
    FOR SELECT USING (true);

CREATE POLICY "Only admins and panitia can manage candidates" ON candidates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'panitia')
        )
    );

-- Create policies for voters table
CREATE POLICY "Anyone can view voters" ON voters
    FOR SELECT USING (true);

CREATE POLICY "Only admins and panitia can manage voters" ON voters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'panitia')
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;


































