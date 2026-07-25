import { AlertCircle } from "lucide-react"

import type { PhasesScoreResult } from "@/lib/phases"

type PhasesScoreCardProps = PhasesScoreResult & {
  isEmpty: boolean
}

export function PhasesScoreCard({ score, risk, isEmpty }: PhasesScoreCardProps) {
  if (isEmpty) {
    return (
      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="text-yellow-500" />
          <h2 className="text-md font-bold">PHASES Score</h2>
        </div>
        <p className="text-xl font-bold">-</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="text-blue-500" />
        <h2 className="text-md font-bold">PHASES Score</h2>
      </div>
      <p className="text-3xl font-bold">{score}</p>
      <p className="text-md mt-1">
        5-year rupture risk: <span className="font-semibold">{risk}</span>
      </p>
    </div>
  )
}
