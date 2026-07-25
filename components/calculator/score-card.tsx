import type { LucideIcon } from "lucide-react"

export type ScoreCardProps = {
  icon: LucideIcon
  title: string
  score: number
  isEmpty?: boolean
}

export function ScoreCard({ icon: Icon, title, score, isEmpty }: ScoreCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon />
        <h2 className="text-md font-bold">{title}</h2>
      </div>
      <p className="text-3xl font-bold">{isEmpty ? "-" : score}</p>
    </div>
  )
}
