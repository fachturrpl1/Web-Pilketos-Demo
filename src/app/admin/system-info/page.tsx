"use client"

import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  IconServer, 
  IconDatabase, 
  IconShield, 
  IconCpu, 
  IconGauge, 
  IconNetwork,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconRefresh
} from "@tabler/icons-react"
import { useState } from "react"

export default function AdminSystemInfo() {
  const [systemStats, setSystemStats] = useState({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 12,
    uptime: "5 hari, 12 jam, 30 menit",
    lastBackup: "2 jam yang lalu",
    version: "1.0.0",
    build: "2024.01.15"
  })

  const [systemStatus] = useState({
    database: "online",
    api: "online", 
    cache: "online",
    queue: "online",
    storage: "online"
  })

  const handleRefreshStats = () => {
    // Simulasi refresh statistik sistem
    setSystemStats(prev => ({
      ...prev,
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
      lastBackup: "Baru saja"
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700'
      case 'warning': return 'bg-yellow-100 text-yellow-700'
      case 'error': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <IconCheck className="h-4 w-4" />
      case 'warning': return <IconAlertTriangle className="h-4 w-4" />
      case 'error': return <IconAlertTriangle className="h-4 w-4" />
      default: return <IconClock className="h-4 w-4" />
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Informasi Sistem</h1>
          <p className="text-gray-600">Monitor status dan performa sistem pemilihan</p>
        </div>
        <Button onClick={handleRefreshStats} variant="outline">
          <IconRefresh className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <IconCpu className="h-4 w-4" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.cpu}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemStats.cpu}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <IconGauge className="h-4 w-4" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.memory}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemStats.memory}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <IconDatabase className="h-4 w-4" />
              Disk Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.disk}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemStats.disk}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <IconNetwork className="h-4 w-4" />
              Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.network}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemStats.network}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShield className="h-5 w-5" />
              Status Layanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(systemStatus).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="capitalize">{service}</span>
                </div>
                <Badge className={getStatusColor(status)}>
                  {status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconClock className="h-5 w-5" />
              Informasi Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Uptime</span>
              <span className="font-medium">{systemStats.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span>Backup Terakhir</span>
              <span className="font-medium">{systemStats.lastBackup}</span>
            </div>
            <div className="flex justify-between">
              <span>Versi</span>
              <span className="font-medium">{systemStats.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span className="font-medium">{systemStats.build}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconServer className="h-5 w-5" />
            Log Sistem Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <IconCheck className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sistem berjalan normal</p>
                <p className="text-xs text-gray-500">2 menit yang lalu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <IconDatabase className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Database backup berhasil</p>
                <p className="text-xs text-gray-500">2 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <IconAlertTriangle className="h-4 w-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Memory usage tinggi</p>
                <p className="text-xs text-gray-500">4 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <IconCheck className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Sistem dimulai</p>
                <p className="text-xs text-gray-500">5 hari yang lalu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <IconDatabase className="h-6 w-6" />
              <span>Backup Database</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <IconRefresh className="h-6 w-6" />
              <span>Restart Services</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <IconShield className="h-6 w-6" />
              <span>Security Check</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>Kesehatan Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status Keseluruhan</span>
              <Badge className="bg-green-100 text-green-700">
                <IconCheck className="h-3 w-3 mr-1" />
                Sehat
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Keamanan</span>
              <Badge className="bg-green-100 text-green-700">
                <IconCheck className="h-3 w-3 mr-1" />
                Aman
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Performa</span>
              <Badge className="bg-green-100 text-green-700">
                <IconCheck className="h-3 w-3 mr-1" />
                Optimal
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Konektivitas</span>
              <Badge className="bg-green-100 text-green-700">
                <IconCheck className="h-3 w-3 mr-1" />
                Stabil
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </PageLayout>
  )
}




