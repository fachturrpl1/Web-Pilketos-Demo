"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconDashboard,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconFileText,
  IconStar,
  IconCheck,
  IconTrophy,
  IconUserCheck,
  IconUserPlus,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRole } from "@/contexts/RoleContext"

const memberNavItems = [
  {
    title: "Dashboard",
    url: "/member/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Profil Kandidat",
    url: "/member/candidates",
    icon: IconUsers,
  },
  {
    title: "Voting",
    url: "/member/voting",
    icon: IconCheck,
  },
  {
    title: "Hasil",
    url: "/member/results",
    icon: IconTrophy,
  },
]

const panitiaNavItems = [
  {
    title: "Dashboard",
    url: "/panitia/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Monitoring Voting",
    // url removed: "/panitia/monitoring",
    icon: IconChartBar,
  },
  {
    title: "Manajemen Kandidat",
    url: "/panitia/candidates",
    icon: IconStar,
  },
  {
    title: "Daftar Pemilih",
    url: "/panitia/voters",
    icon: IconUserPlus,
  },
  {
    title: "Hasil Pemilihan",
    url: "/panitia/results",
    icon: IconUserCheck,
  },
]

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Kelola Kandidat",
    url: "/admin/candidates",
    icon: IconStar,
  },
  {
    title: "Kelola Pemilih",
    url: "/admin/voters",
    icon: IconUserPlus,
  },
  {
    title: "Hasil Pemilihan",
    url: "/admin/results",
    icon: IconChartBar,
  },
]

const getSecondaryNavItems = (role: string) => {
  const bantuanItem = {
    title: "Bantuan",
    url: getHelpUrl(role),
    icon: IconFileText,
  }

  const pengaturanItem = {
    title: "Pengaturan",
    url: "/admin/settings",
    icon: IconSettings,
  }

  // Hanya tampilkan "Pengaturan" untuk role admin
  if (role === 'admin') {
    return [pengaturanItem, bantuanItem]
  }
  
  // Untuk role panitia dan member, hanya tampilkan "Bantuan"
  return [bantuanItem]
}

const getHelpUrl = (role: string) => {
  switch (role) {
    case 'admin':
      return '/admin/bantuan-admin'
    case 'panitia':
      return '/panitia/bantuan-panitia'
    case 'member':
      return '/member/bantuan-member'
    default:
      return '/member/bantuan-member'
  }
}

export function ElectionSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentRole, user } = useRole()

  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return adminNavItems
      case 'panitia':
        return panitiaNavItems
      case 'member':
      default:
        return memberNavItems
    }
  }

  const getSecondaryNavItemsForRole = () => {
    return getSecondaryNavItems(currentRole)
  }

  const getDashboardUrl = () => {
    switch (currentRole) {
      case 'admin':
        return '/admin/dashboard'
      case 'panitia':
        return '/panitia/dashboard'
      case 'member':
      default:
        return '/member/dashboard'
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={getDashboardUrl()}>
                <IconStar className="!size-5 text-blue-600" />
                <span className="text-base font-semibold">Pemilihan OSIS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems()} />
        <NavSecondary items={getSecondaryNavItemsForRole()} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ ...user, avatar: user.avatar || "/avatars/default.jpg" }} />
      </SidebarFooter>
    </Sidebar>
  )
}

