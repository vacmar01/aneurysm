import { AlertCircle, Slice, Tablets } from "lucide-react"

import {
  calculateUiatsRecommendation,
  type UiatsScores,
} from "@/lib/uiats"

type RecommendationCardProps = UiatsScores & {
  isEmpty?: boolean
}

export function RecommendationCard({
  intervention,
  conservative,
  isEmpty,
}: RecommendationCardProps) {
  if (isEmpty) {
    return (
      <div className="rounded-lg border p-4">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="text-yellow-500" />
          <h2 className="text-md font-bold">UIATS Recommendation</h2>
        </div>
        <p className="text-xl font-bold">-</p>
      </div>
    )
  }

  const recommendation = calculateUiatsRecommendation({
    intervention,
    conservative,
  })
  const presentation = {
    interventional: {
      label: "interventional treatment",
      icon: Slice,
      color: "text-red-500",
    },
    conservative: {
      label: "conservative management",
      icon: Tablets,
      color: "text-green-500",
    },
    "not-definitive": {
      label: "not definitive",
      icon: AlertCircle,
      color: "text-yellow-500",
    },
  }[recommendation]

  const IconComponent = presentation.icon

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <IconComponent className={presentation.color} />
        <h2 className="text-md font-bold">Recommendation</h2>
      </div>
      <p className="text-xl font-bold capitalize">{presentation.label}</p>
    </div>
  )
}
