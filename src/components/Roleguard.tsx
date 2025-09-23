"use client"

import { useRole } from "@/contexts/RoleContext"
import { UserRole } from "@/contexts/RoleContext"
import { ReactNode } from "react"

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { currentRole } = useRole()

  if (!allowedRoles.includes(currentRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
            <p className="text-gray-600">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Role yang diizinkan: {allowedRoles.join(", ")}
            </p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}




















