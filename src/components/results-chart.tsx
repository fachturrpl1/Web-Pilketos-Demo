"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Candidate } from "@/types/database"
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import type { TooltipItem } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { useState } from "react"
import { IconRefresh } from "@tabler/icons-react"

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

interface ResultsChartProps {
  candidates: Candidate[]
  onRefresh?: () => void
}

export function ResultsChart({ candidates, onRefresh }: ResultsChartProps) {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

  const chartData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [
      {
        data: candidates.map(candidate => candidate.votes),
        backgroundColor: [
          '#3B82F6', // blue-500
          '#10B981', // emerald-500
          '#F59E0B', // amber-500
          '#EF4444', // red-500
          '#8B5CF6', // violet-500
        ],
        borderColor: [
          '#1E40AF', // blue-700
          '#047857', // emerald-700
          '#D97706', // amber-700
          '#DC2626', // red-700
          '#7C3AED', // violet-700
        ],
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Jumlah Suara',
        data: candidates.map(candidate => candidate.votes),
        backgroundColor: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            const value = typeof context.parsed === 'number' ? context.parsed : Number(context.parsed)
            const percentage = totalVotes > 0 ? ((value / totalVotes) * 100).toFixed(1) : '0.0'
            return `${context.label}: ${value} suara (${percentage}%)`
          }
        }
      }
    },
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hasil Pemilihan</h2>
          <p className="text-gray-600">Total suara: {totalVotes}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 text-sm rounded-l-lg ${
                chartType === 'pie' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded-r-lg ${
                chartType === 'bar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bar Chart
            </button>
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <IconRefresh className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grafik Hasil Pemilihan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {chartType === 'pie' ? (
              <Pie data={chartData} options={chartOptions} />
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate, index) => {
          const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0'
          return (
            <Card key={candidate.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{candidate.name}</h3>
                  <span className="text-sm text-gray-500">{candidate.class}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Suara:</span>
                    <span className="font-medium">{candidate.votes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Persentase:</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

