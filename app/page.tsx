"use client"
import { useEffect, useMemo, useRef, useState } from "react"

import { Tablets, Slice, AlertCircle, Info, ArrowDown } from "lucide-react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
          <h2 className="text-md font-bold">UIATS Recommendation</h2>
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

function ScoreSummary({ formState, uiatsScores, className = "", cardsClassName = "space-y-4" }: {
  formState: FormState
  uiatsScores: UiatsScores
  className?: string
  cardsClassName?: string
}) {
  const isEmpty = Object.keys(formState).length === 0

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">Scores</h2>
      <div className={cardsClassName}>
        <ScoreCard icon={Slice} title="UIATS Intervention" score={uiatsScores.intervention} isEmpty={isEmpty} />
        <ScoreCard icon={Tablets} title="UIATS Conservative" score={uiatsScores.conservative} isEmpty={isEmpty} />
        <RecommendationCard intervention={uiatsScores.intervention} conservative={uiatsScores.conservative} isEmpty={isEmpty} />
        <PhasesScoreCard formState={formState} isEmpty={isEmpty} />
      </div>
    </div>
  )
}

export default function Home() {
  const [formState, setFormState] = useState<FormState>({})
  const [resultsVisible, setResultsVisible] = useState(false)
  const resultsRef = useRef<HTMLElement>(null)
  const uiatsScores = useMemo(() => calculateUiatsScores(formState), [formState])
  const phasesScoreResult = useMemo(() => calculatePhasesScore(formState), [formState])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form State:', formState)
    console.log('UIATS Scores:', uiatsScores)
    console.log('PHASES Score:', phasesScoreResult)
  }

  useEffect(() => {
    const results = resultsRef.current
    if (!results) return

    const observer = new IntersectionObserver(
      ([entry]) => setResultsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )

    observer.observe(results)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {/* hero */}
      <div className="bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50 border-b">
        <div className="flex flex-col justify-center items-center space-y-2 py-16">
          <div className="max-w-3xl text-center">
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-6xl mb-6">
              Aneurysm Risk Calculator
            </h1>
            <p className="text-muted-foreground lg:text-lg text-balance">
              Calculate overall aneurysm risk, including treatment and conservative rupture risk, using UIATS and PHASES scores.
              UIATS by <a className="underline hover:text-foreground transition-colors" href="https://www.ncbi.nlm.nih.gov/pubmed/26276380" target="_blank" rel="noopener noreferrer">Etminan et al. 2015</a>.
              PHASES by <a className="underline hover:text-foreground transition-colors" href="https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(13)70263-1/abstract" target="_blank" rel="noopener noreferrer">Greving et al. 2014</a>.
            </p>
          </div>
        </div>
      </div>
      {/* Score Calculator */}
      <div className="p-2 pb-20 lg:pb-2">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 px-4 sm:px-8 max-w-[1200px] mx-auto">
          <aside className="hidden lg:block mt-4 w-[320px] shrink-0 border-r pr-8">
            <div className="sticky top-12">
              <ScoreSummary formState={formState} uiatsScores={uiatsScores} />
            </div>
          </aside>
          <form className="min-w-0 flex-1 space-y-6 py-4" onSubmit={handleSubmit}>
            {formItems.map((item) => (
              <div key={item.id}>
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-bold">{item.label}</Label>
                  {item.tooltip && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          aria-label={`More information about ${item.label}`}
                          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        >
                          <Info className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="leading-relaxed">
                        {item.tooltip}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                {item.type === "single" ? (
                  <Select onValueChange={(value) => handleSingleSelect(item.id, value)} value={formState[item.id] as string || ""}>
                    <SelectTrigger className="w-full sm:w-[280px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {item.options?.map((option) => (
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
                      step={item.id === "age" ? "1" : "0.1"}
                      min={item.id === "age" ? "18" : "0"}
                      placeholder={`Enter ${item.label.toLowerCase()}`}
                      onChange={(e) => handleNumberInput(item.id, e.target.value)}
                      value={formState[item.id] as number ?? ""}
                      className="w-full sm:w-[180px]"
                    />
                    {item.id === "maximumDiameter" && <span className="text-sm text-muted-foreground">mm</span>}
                  </div>
                ) : (
                  item.options?.map((option) => (
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
          <section ref={resultsRef} id="results" className="lg:hidden scroll-mt-6">
            <ScoreSummary
              formState={formState}
              uiatsScores={uiatsScores}
              cardsClassName="grid grid-cols-2 gap-3"
            />
          </section>
        </div>
      </div>
      {!resultsVisible && (
        <a
          href="#results"
          className="lg:hidden fixed bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
        View results
          <ArrowDown className="size-4" />
        </a>
      )}
      {/* Footer */}
      <footer className="bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50 border-t mt-16">
        <div className="max-w-[1200px] mx-auto py-8 px-8 text-center text-muted-foreground">
          <p>Created with ❤️ by Dr. Marius Vach - <a href="https://github.com/vacmar01/aneurysm" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">GitHub</a></p>
        </div>
      </footer>
    </div>
  );
}
