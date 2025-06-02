"use client"
import { useState, useEffect } from "react"

import { Tablets, Slice, AlertCircle } from "lucide-react"
import { LucideIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import { formItems } from "../lib/form"
import { calculatePhasesScore, PhasesScoreResult } from "../lib/phases"
import { calculateUiatsScores, UiatsScores } from "../lib/uiats"
import { FormState } from "../lib/types"

interface ScoreCardProps {
  icon: LucideIcon
  title: string
  score: number
}

function ScoreCard({ icon: Icon, title, score, isEmpty }: ScoreCardProps & { isEmpty?: boolean }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Icon />
        <h2 className="text-md font-bold">{title}</h2>
      </div>
      <p className="text-3xl font-bold">{isEmpty ? "-" : score}</p>
    </div>
  )
}

function RecommendationCard({ intervention, conservative, isEmpty }: UiatsScores & { isEmpty?: boolean }) {
  if (isEmpty) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <AlertCircle className="text-yellow-500" />
          <h2 className="text-md font-bold">Recommendation</h2>
        </div>
        <p className="text-xl font-bold">-</p>
      </div>
    )
  }

  const difference = Math.abs(intervention - conservative)
  let recommendation = "not definitive"
  let icon: LucideIcon = AlertCircle
  let color = "text-yellow-500"

  if (difference >= 3) {
    if (intervention > conservative) {
      recommendation = "interventional treatment"
      icon = Slice
      color = "text-red-500"
    } else {
      recommendation = "conservative management"
      icon = Tablets
      color = "text-green-500"
    }
  }

  const IconComponent = icon

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <IconComponent className={color} />
        <h2 className="text-md font-bold">Recommendation</h2>
      </div>
      <p className="text-xl font-bold capitalize">{recommendation}</p>
    </div>
  )
}

function PhasesScoreCard({ formState, isEmpty }: { formState: FormState, isEmpty: boolean }) {
  if (isEmpty) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground">
          <AlertCircle className="text-yellow-500" />
          <h2 className="text-md font-bold">PHASES Score</h2>
        </div>
        <p className="text-xl font-bold">-</p>
      </div>
    )
  }
  const { score, risk } = calculatePhasesScore(formState)
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <AlertCircle className="text-blue-500" />
        <h2 className="text-md font-bold">PHASES Score</h2>
      </div>
      <p className="text-3xl font-bold">{score}</p>
      <p className="text-md mt-1">5-year rupture risk: <span className="font-semibold">{risk}</span></p>
    </div>
  )
}

export default function Home() {
  const [formState, setFormState] = useState<FormState>({})
  const [uiatsScores, setUiatsScores] = useState<UiatsScores>({ intervention: 0, conservative: 5 })
  const [phasesScoreResult, setPhasesScoreResult] = useState<PhasesScoreResult>({ score: 0, risk: "-" })

  const handleSingleSelect = (itemId: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [itemId]: value
    }))
  }

  const handleMultipleSelect = (itemId: string, optionValue: string, checked: boolean) => {
    setFormState(prev => {
      const currentSelection = (prev[itemId] as string[] | undefined) || []
      if (checked) {
        return {
          ...prev,
          [itemId]: [...currentSelection, optionValue]
        }
      } else {
        return {
          ...prev,
          [itemId]: currentSelection.filter(v => v !== optionValue)
        }
      }
    })
  }

  const handleNumberInput = (itemId: string, value: string) => {
    const numValue = parseFloat(value)
    setFormState(prev => ({
      ...prev,
      [itemId]: isNaN(numValue) ? undefined : numValue
    }))
  }

  // Update scores whenever form state changes
  useEffect(() => {
    setUiatsScores(calculateUiatsScores(formState))
    setPhasesScoreResult(calculatePhasesScore(formState))
  }, [formState])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form State:', formState)
    console.log('UIATS Scores:', uiatsScores)
    console.log('PHASES Score:', phasesScoreResult)
  }

  return (
    <div>
      {/* hero */}
      <div className="bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50 border-b">
        <div className="flex flex-col justify-center items-center space-y-2 py-16">
          <div className="max-w-2xl text-center">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-6xl mb-6">
              Score Calculator
            </h1>
            <p className="text-muted-foreground lg:text-lg text-balance">
              Calculate UIATS and PHASES scores for unruptured intracranial aneurysms.
              UIATS by <a className="underline hover:text-foreground transition-colors" href="https://www.ncbi.nlm.nih.gov/pubmed/26276380" target="_blank" rel="noopener noreferrer">Etminan et al. 2015</a>.
              PHASES details at <a className="underline hover:text-foreground transition-colors" href="https://radiopaedia.org/articles/phases-risk-prediction-score-1" target="_blank" rel="noopener noreferrer">Radiopaedia</a>.
            </p>
          </div>
        </div>
      </div>
      {/* Score Calculator */}
      <div className="p-2">
        <div className="flex gap-16 px-8 max-w-[1200px] mx-auto">
          <div className="mt-4 w-[320px] border-r pr-8">
            <div className="sticky top-12 space-y-4 ">
              <h2 className="text-xl font-bold">Scores</h2>
              <ScoreCard
                icon={Slice}
                title="UIATS Intervention"
                score={uiatsScores.intervention}
                isEmpty={Object.keys(formState).length === 0}
              />
              <ScoreCard
                icon={Tablets}
                title="UIATS Conservative"
                score={uiatsScores.conservative}
                isEmpty={Object.keys(formState).length === 0}
              />
              <RecommendationCard
                intervention={uiatsScores.intervention}
                conservative={uiatsScores.conservative}
                isEmpty={Object.keys(formState).length === 0}
              />
              <PhasesScoreCard
                formState={formState}
                isEmpty={Object.keys(formState).length === 0}
              />
            </div>
          </div>
          <form className="space-y-6 py-4" onSubmit={handleSubmit}>
            {formItems.map((item) => (
              <div key={item.id}>
                <Label className="text-lg font-bold">{item.label}</Label>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                {item.type === "single" ? (
                  <Select onValueChange={(value) => handleSingleSelect(item.id, value)} value={formState[item.id] as string || ""}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {item.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : item.type === "number" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder={`Enter ${item.label.toLowerCase()}`}
                      onChange={(e) => handleNumberInput(item.id, e.target.value)}
                      value={formState[item.id] as number || ""}
                      className="w-[180px]"
                    />
                    {item.id === "maximumDiameter" && <span className="text-sm text-muted-foreground">mm</span>}
                  </div>
                ) : (
                  item.options.map((option) => (
                    <div key={`${item.id}-${option.value}`} className="flex items-center gap-2">
                      <Checkbox
                        id={`${item.id}-${option.value}`}
                        onCheckedChange={(checked) =>
                          handleMultipleSelect(item.id, option.value, checked as boolean)
                        }
                        checked={(formState[item.id] as string[] | undefined)?.includes(option.value) || false}
                      />
                      <label htmlFor={`${item.id}-${option.value}`}>{option.label}</label>
                    </div>
                  ))
                )}
              </div>
            ))}
          </form>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50 border-t mt-16">
        <div className="max-w-[1200px] mx-auto py-8 px-8 text-center text-muted-foreground">
          <p>Created with ❤️ by Dr. Marius Vach - <a href="https://github.com/vacmar01/aneurysm" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}
