"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Dialog component not available, using simple modal instead
import { Candidate } from "@/types"
import { IconUser, IconEye } from "@tabler/icons-react"

interface CandidateCardProps {
  candidate: Candidate
  showVoteButton?: boolean
  onVote?: (candidateId: string) => void
  hasVoted?: boolean
}

export function CandidateCard({ 
  candidate, 
  showVoteButton = false, 
  onVote,
  hasVoted = false 
}: CandidateCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Normalize mission to string[] so UI never shows raw JSON brackets
  const missionItems = useMemo(() => {
    if (Array.isArray(candidate.mission)) return candidate.mission
    if (typeof candidate.mission === 'string') {
      try {
        const parsed = JSON.parse(candidate.mission)
        if (Array.isArray(parsed)) return parsed
      } catch {
        // ignore
      }
      return candidate.mission.split('\n').filter(Boolean)
    }
    return [] as string[]
  }, [candidate.mission])

  const handleVote = () => {
    if (onVote && !hasVoted) {
      onVote(candidate.id)
    }
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <IconUser className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <p className="text-sm text-gray-600">{candidate.class}</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {candidate.votes} suara
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-700 line-clamp-2 mb-4">
            {candidate.vision}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setIsModalOpen(true)}
            >
              <IconEye className="h-4 w-4 mr-1" />
              Lihat Detail
            </Button>
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{candidate.name}</h2>
                      <p className="text-gray-600">{candidate.class}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                      ✕
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Visi</h4>
                      <p className="text-gray-700">{candidate.vision}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">Misi</h4>
                      <div className="text-gray-700">
                        {missionItems.map((item, index) => (
                          <div key={index} className="mb-1">
                            {index + 1}. {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showVoteButton && (
              <Button 
                onClick={handleVote}
                disabled={hasVoted}
                className="flex-1"
                variant={hasVoted ? "secondary" : "default"}
              >
                {hasVoted ? "Sudah Memilih" : "Pilih"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

