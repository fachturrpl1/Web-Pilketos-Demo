"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RoleSwitcher } from "@/components/role-switcher"
import { useRole } from "@/contexts/RoleContext"
// Clock icon removed

export function ElectionHeader() {
  const { currentRole } = useRole()

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin'
      case 'panitia': return 'Panitia'
      case 'member': return 'Member'
      default: return 'Member'
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-blue-600">Pemilihan Ketua OSIS</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <span>Role aktif:</span>
            <span className="font-medium text-blue-600">{getRoleDisplay(currentRole)}</span>
          </div>
          <RoleSwitcher />
        </div>
      </div>
    </header>
  )
}

