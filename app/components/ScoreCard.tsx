import { LucideIcon } from "lucide-react"

interface ScoreCardProps {
    icon: LucideIcon
    title: string
    score: number
}

export function ScoreCard({ icon: Icon, title, score }: ScoreCardProps) {
    return (
        <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <Icon />
                <h2 className="text-md font-bold">{title}</h2>
            </div>
            <p className="text-3xl font-bold">{score}</p>
        </div>
    )
} 