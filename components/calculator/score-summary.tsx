import { Slice, Tablets } from "lucide-react"

import type { PhasesScoreResult } from "@/lib/phases"
import type { UiatsScores } from "@/lib/uiats"

import { PhasesScoreCard } from "./phases-score-card"
import { RecommendationCard } from "./recommendation-card"
import { ScoreCard } from "./score-card"

type ScoreSummaryProps = {
  uiatsScores: UiatsScores
  phasesScore: PhasesScoreResult
  isEmpty: boolean
  className?: string
  cardsClassName?: string
}

export function ScoreSummary({
  uiatsScores,
  phasesScore,
  isEmpty,
  className = "",
  cardsClassName = "space-y-4",
}: ScoreSummaryProps) {
  return (
    <div className={className}>
      <h2 className="mb-4 text-xl font-bold">Scores</h2>
      <div className={cardsClassName}>
        <ScoreCard
          icon={Slice}
          title="UIATS Intervention"
          score={uiatsScores.intervention}
          isEmpty={isEmpty}
        />
        <ScoreCard
          icon={Tablets}
          title="UIATS Conservative"
          score={uiatsScores.conservative}
          isEmpty={isEmpty}
        />
        <RecommendationCard
          intervention={uiatsScores.intervention}
          conservative={uiatsScores.conservative}
          isEmpty={isEmpty}
        />
        <PhasesScoreCard {...phasesScore} isEmpty={isEmpty} />
      </div>
    </div>
  )
}
