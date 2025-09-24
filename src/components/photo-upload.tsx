"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconUpload, IconX, IconLoader2 } from "@tabler/icons-react"

interface PhotoUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
}

export function PhotoUpload({ value, onChange, disabled = false, className = "" }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)

  // Sinkronkan preview ketika prop value berubah dari luar
  useEffect(() => {
    setPreview(value || null)
  }, [value])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validasi file
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Ukuran file maksimal 5MB!')
      return
    }

    setIsUploading(true)

    try {
      // Baca file secara lokal (tanpa koneksi ke storage/database)
      const reader = new FileReader()
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Gagal membaca file'))
        reader.readAsDataURL(file)
      })

      setPreview(dataUrl)
      onChange(dataUrl) // simpan sebagai Data URL pada state/form
    } catch (error: unknown) {
      console.error('Local read error:', error)
      const message = error instanceof Error ? error.message : 'Silakan coba lagi.'
      alert(`Gagal memproses foto: ${message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemovePhoto = () => {
    setPreview(null)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setPreview(url)
    onChange(url)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Foto */}
      {preview && (
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border-2 border-gray-2 00">
            {/* Use ExternalImage to support both next/image (allowed hosts) and fallback <img> */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
            onClick={handleRemovePhoto}
            disabled={disabled || isUploading}
          >
            <IconX className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-3">
        {/* Upload File */}
        <div>
          <Label htmlFor="photo-upload" className="text-sm font-medium text-gray-700">
            Upload Foto
          </Label>
          <div className="mt-1">
            <Input
              ref={fileInputRef}
              id="photo-upload"
              type="file"
              accept="image/*"
              // Memudahkan kamera di perangkat mobile
              capture="environment"
              onChange={handleFileSelect}
              disabled={disabled || isUploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <IconUpload className="h-4 w-4 mr-2" />
                  Pilih Foto
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Atau URL */}
        <div className="text-center text-sm text-gray-500">atau</div>

        {/* URL Input */}
        <div>
          <Label htmlFor="photo-url" className="text-sm font-medium text-gray-700">
            URL Foto
          </Label>
          <Input
            id="photo-url"
            type="url"
            value={value || ""}
            onChange={handleUrlChange}
            placeholder="https://example.com/photo.jpg"
            disabled={disabled || isUploading}
            className="w-full"
          />
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        Format: JPG, PNG, GIF. Maksimal 5MB.
      </div>
    </div>
  )
}



