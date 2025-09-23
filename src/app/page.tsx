"use client"

import { RoleProvider } from "@/contexts/RoleContext"
import { ElectionSidebar } from "@/components/election-sidebar"
import { ElectionHeader } from "@/components/election-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useRole } from "@/contexts/RoleContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  IconStar, 
  IconUsers, 
  IconCheck, 
  IconTrophy,
  IconChartBar,
  IconSettings,
  IconUsersGroup,
  IconClipboard
} from "@tabler/icons-react"

function MainContent() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang di Sistem Pemilihan OSIS</h1>
            <p className="text-blue-100">Silakan gunakan menu di sidebar sesuai peran Anda.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function HomePage() {
  return (
    <RoleProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 16)",
          } as React.CSSProperties
        }
      >
        <ElectionSidebar variant="inset" />
        <SidebarInset>
          <ElectionHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <MainContent />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}