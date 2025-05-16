"use client"
import { useState, useEffect } from "react"

import { Tablets, Slice } from "lucide-react"

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

type Scores = {
  intervention: number;
  conservative: number;
}

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

  const calculateScores = (state: Record<string, number>): Scores => {
    const scores: Scores = { intervention: 0, conservative: 5 } // Conservative starts with 5 points

    uiats.forEach(uiat => {
      const value = state[uiat.id] || 0
      if (uiat.pro === "intervention") {
        scores.intervention += value
      } else {
        scores.conservative += value
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
    <div className="p-2">
      <div className="flex flex-col justify-center items-center space-y-2 py-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          UIATS Score Calculator
        </h1>
        <p className="text-muted-foreground mb-4">
          The UIATS score is a tool to help you determine the risk of aneurysms in your patients.
        </p>
        <p className="text-muted-foreground">
          The UIATS score was developed by <a className="underline" href="https://www.ncbi.nlm.nih.gov/pubmed/26000000" target="_blank" rel="noopener noreferrer">Etminan et al. 2015 </a>
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex gap-16 px-8">
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
              ) : (
                null
              )}
              {uiat.type === "multiple" && (
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
          ))
          }
        </form>
      </div >
    </div>
  );
}
