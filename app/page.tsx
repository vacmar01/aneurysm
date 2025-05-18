"use client"
import { useState, useEffect } from "react"

import { Tablets, Slice, AlertCircle } from "lucide-react"

import { LucideIcon } from "lucide-react"


import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { uiats } from "@/lib/uaits"
import { Input } from "@/components/ui/input"

type Scores = {
  intervention: number;
  conservative: number;
}

interface ScoreCardProps {
  icon: LucideIcon
  title: string
  score: number
}

function ScoreCard({ icon: Icon, title, score }: ScoreCardProps) {
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

function RecommendationCard({ intervention, conservative }: Scores) {
  const difference = Math.abs(intervention - conservative)
  let recommendation = "not definitive"
  let icon = AlertCircle
  let color = "text-yellow-500"

  if (difference >= 3) {
    if (intervention > conservative) {
      recommendation = "interventional treatment"
      icon = Slice
      color = "text-red-500"
    } else {
      recommendation = "conservative treatment"
      icon = Tablets
      color = "text-green-500"
    }
  }

  const Icon = icon

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Icon className={color} />
        <h2 className="text-md font-bold">Recommendation</h2>
      </div>
      <p className="text-xl font-bold capitalize">{recommendation}</p>
    </div>
  )
}

export default function Home() {
  const [formState, setFormState] = useState<Record<string, number>>({})
  const [scores, setScores] = useState<Scores>({ intervention: 0, conservative: 5 }) // Conservative starts with 5 points

  const handleSingleSelect = (uiatId: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [uiatId]: parseInt(value)
    }))
  }

  const handleMultipleSelect = (uiatId: string, optionValue: number, checked: boolean) => {
    setFormState(prev => {
      const currentValue = prev[uiatId] || 0
      return {
        ...prev,
        [uiatId]: checked ? currentValue + optionValue : currentValue - optionValue
      }
    })
  }

  const handleNumberInput = (uiatId: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormState(prev => ({
      ...prev,
      [uiatId]: numValue
    }))
  }

  const calculateScores = (state: Record<string, number>): Scores => {
    const scores: Scores = { intervention: 0, conservative: 5 } // Conservative starts with 5 points

    uiats.forEach(uiat => {
      const value = state[uiat.id] || 0

      // Special handling for age and maximumDiameter
      if (uiat.id === "age") {
        // Age contributes to both scores
        // For intervention: higher score for younger patients (as is)
        scores.intervention += value
        // For conservative: higher score for older patients (inverse of intervention)
        // Convert the value to conservative score (0->5, 1->4, 2->3, 3->2, 4->1, 5->0)
        scores.conservative += (4 - value)
      } else if (uiat.id === "maximumDiameter") {
        // Calculate intervention score based on diameter
        let interventionScore = 0
        if (value < 3.9) interventionScore = 0
        else if (value <= 6.9) interventionScore = 1
        else if (value <= 12.9) interventionScore = 2
        else if (value <= 24.9) interventionScore = 3
        else interventionScore = 4

        // Calculate conservative score based on diameter
        let conservativeScore = 0
        if (value < 6) conservativeScore = 0
        else if (value <= 10) conservativeScore = 1
        else if (value <= 20) conservativeScore = 3
        else conservativeScore = 5

        scores.intervention += interventionScore
        scores.conservative += conservativeScore
      } else {
        // Normal scoring for all other items
        if (uiat.pro === "intervention") {
          scores.intervention += value
        } else {
          scores.conservative += value
        }
      }
    })

    return scores
  }

  // Update scores whenever form state changes
  useEffect(() => {
    setScores(calculateScores(formState))
  }, [formState])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form State:', formState)
    console.log('Scores:', scores)
  }

  return (
    <div>
      {/* hero */}
      <div className="bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50 border-b">
        <div className="flex flex-col justify-center items-center space-y-2 py-16">
          <div className="max-w-2xl text-center">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-6xl mb-6">
              UIATS Score Calculator
            </h1>
            <p className="text-muted-foreground lg:text-lg text-balance">
              The UIATS score is a tool to help you determine the risk of aneurysm rupture in your patients.
              It was developed by <a className="underline hover:text-foreground transition-colors" href="https://www.ncbi.nlm.nih.gov/pubmed/26276380" target="_blank" rel="noopener noreferrer">Etminan et al. 2015 </a>
            </p>
          </div>
        </div>
      </div>
      {/* Score Calculator */}
      <div className="p-2">
        <div className="flex gap-16 px-8 max-w-[1200px] mx-auto">
          <div className="mt-4 w-[320px] border-r pr-8">
            <div className="sticky top-12 space-y-4 ">
              <h2 className="text-xl font-bold">UIATS Score</h2>
              <ScoreCard
                icon={Slice}
                title="Intervention Score"
                score={scores.intervention}
              />
              <ScoreCard
                icon={Tablets}
                title="Conservative Score"
                score={scores.conservative}
              />
              <RecommendationCard intervention={scores.intervention} conservative={scores.conservative} />
            </div>
          </div>
          <form className="space-y-6 py-4" onSubmit={handleSubmit}>
            {uiats.map((uiat) => (
              <div key={uiat.id}>
                <Label className="text-lg font-bold">{uiat.label}</Label>
                <p className="text-sm text-muted-foreground mb-4">{uiat.description}</p>
                {uiat.type === "single" ? (
                  <Select onValueChange={(value) => handleSingleSelect(uiat.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {uiat.options.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : uiat.type === "number" ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Enter diameter in mm"
                      onChange={(e) => handleNumberInput(uiat.id, e.target.value)}
                      className="w-[180px]"
                    />
                    <span className="text-sm text-muted-foreground">mm</span>
                  </div>
                ) : (
                  uiat.options.map((option, idx) => (
                    <div key={`${uiat.id}-${idx}`} className="flex items-center gap-2">
                      <Checkbox
                        id={`${uiat.id}-${idx}`}
                        onCheckedChange={(checked) =>
                          handleMultipleSelect(uiat.id, option.value, checked as boolean)
                        }
                      />
                      <label htmlFor={`${uiat.id}-${idx}`}>{option.label}</label>
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
          <p>Created with ❤️ by Marius Vach - <a href="https://github.com/vacmar01/aneurysm" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}
