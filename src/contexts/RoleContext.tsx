"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'

export type UserRole = 'admin' | 'panitia' | 'member'

interface RoleContextType {
  currentRole: UserRole
  setRole: (role: UserRole) => void
  user: {
    name: string
    email: string
    avatar: string
  }
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useAuth()
  const [currentRole, setCurrentRole] = useState<UserRole>('member')
  
  // Update role based on user profile
  useEffect(() => {
    if (userProfile?.role) {
      setCurrentRole(userProfile.role)
    }
  }, [userProfile])

  const user = {
    name: userProfile?.name || "Siswa Demo",
    email: userProfile?.email || "siswa@demo.com",
    avatar: userProfile?.avatar_url || "/avatars/demo.jpg"
  }

  const setRole = (role: UserRole) => {
    setCurrentRole(role)
  }

  return (
    <RoleContext.Provider value={{ currentRole, setRole, user }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}


