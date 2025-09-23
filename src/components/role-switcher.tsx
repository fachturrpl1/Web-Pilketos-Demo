"use client"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useRole, UserRole } from "@/contexts/RoleContext"
import { IconChevronDown, IconUser, IconUsers, IconShieldCheck } from "@tabler/icons-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const roleConfig = {
  admin: {
    label: 'Admin',
    icon: IconShieldCheck,
    color: 'text-red-600',
    dashboardUrl: '/admin/dashboard'
  },
  panitia: {
    label: 'Panitia',
    icon: IconUsers,
    color: 'text-blue-600',
    dashboardUrl: '/panitia/dashboard'
  },
  member: {
    label: 'Member',
    icon: IconUser,
    color: 'text-green-600',
    dashboardUrl: '/member/dashboard'
  }
}

export function RoleSwitcher() {
  const { currentRole, setRole } = useRole()
  const router = useRouter()
  const pathname = usePathname()
  const currentConfig = roleConfig[currentRole]
  const CurrentIcon = currentConfig.icon

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as UserRole)
    // Navigate to the dashboard of the selected role
    const dashboardUrl = roleConfig[newRole as keyof typeof roleConfig].dashboardUrl
    router.push(dashboardUrl)
  }

  // Sync role with URL prefix
  useEffect(() => {
    const path = pathname || "/"
    let roleFromPath: UserRole | null = null
    if (path.startsWith('/admin')) roleFromPath = 'admin'
    else if (path.startsWith('/panitia')) roleFromPath = 'panitia'
    else if (path.startsWith('/member')) roleFromPath = 'member'

    if (roleFromPath && roleFromPath !== currentRole) {
      setRole(roleFromPath)
    }
  }, [pathname, currentRole, setRole])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentConfig.label}</span>
          <IconChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleChange(role)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {config.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

