import { supabase } from './supabase'

export const setupStorage = async () => {
  try {
    // Cek apakah bucket sudah ada
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return { success: false, error: listError.message }
    }

    const candidatePhotosBucket = buckets?.find(bucket => bucket.name === 'candidates_photo')
    
    if (!candidatePhotosBucket) {
      // Buat bucket jika belum ada
      const { data, error } = await supabase.storage.createBucket('candidates_photo', {
        public: true,
        // Tambahkan dukungan HEIC/HEIF untuk device iPhone baru
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (error) {
        console.error('Error creating bucket:', error)
        return { success: false, error: error.message }
      }

      console.log('Bucket created successfully:', data)
      return { success: true, message: 'Bucket created successfully' }
    } else {
      console.log('Bucket already exists:', candidatePhotosBucket)
      return { success: true, message: 'Bucket already exists' }
    }
  } catch (error: unknown) {
    console.error('Setup storage error:', error)
    const message = error instanceof Error ? error.message : 'Failed to setup storage'
    return { success: false, error: message }
  }
}

// Ensure specific bucket exists (idempotent)
export const ensurePhotoBucket = async () => {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) return { success: false, error: listError.message }

    const exists = buckets?.some(b => b.name === 'candidates_photo')
    if (exists) return { success: true }

    const { error } = await supabase.storage.createBucket('candidates_photo', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'],
      fileSizeLimit: 5242880
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to ensure bucket'
    return { success: false, error: message }
  }
}

// Function untuk test upload
export const testUpload = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `test-${Date.now()}.${fileExt}`
    const filePath = `candidates/${fileName}`

    const { data, error } = await supabase.storage
      .from('candidates_photo')
      .upload(filePath, file)

    if (error) {
      throw error
    }

    const { data: urlData } = supabase.storage
      .from('candidates_photo')
      .getPublicUrl(filePath)

    return { success: true, url: urlData.publicUrl }
  } catch (error: unknown) {
    console.error('Test upload error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}



