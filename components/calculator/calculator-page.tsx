"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"

import { calculatePhasesScore } from "@/lib/phases"
import { calculateUiatsScores } from "@/lib/uiats"
import type { FormFieldId, FormState } from "@/lib/types"

import { Questionnaire } from "./questionnaire"
import { ScoreSummary } from "./score-summary"

export default function CalculatorPage() {
  const [formState, setFormState] = useState<FormState>({})
  const [resultsVisible, setResultsVisible] = useState(false)
  const resultsRef = useRef<HTMLElement>(null)

  const uiatsScores = useMemo(
    () => calculateUiatsScores(formState),
    [formState],
  )
  const phasesScore = useMemo(
    () => calculatePhasesScore(formState),
    [formState],
  )
  const isEmpty = Object.keys(formState).length === 0

  const handleSingleSelect = (itemId: FormFieldId, value: string) => {
    setFormState((previous) => ({
      ...previous,
      [itemId]: value,
    }))
  }

  const handleMultipleSelect = (
    itemId: FormFieldId,
    optionValue: string,
    checked: boolean,
  ) => {
    setFormState((previous) => {
      const currentSelection = (previous[itemId] as string[] | undefined) || []

      if (checked) {
        return {
          ...previous,
          [itemId]: [...currentSelection, optionValue],
        }
      }

      return {
        ...previous,
        [itemId]: currentSelection.filter((value) => value !== optionValue),
      }
    })
  }

  const handleNumberInput = (itemId: FormFieldId, value: string) => {
    const numberValue = parseFloat(value)
    setFormState((previous) => ({
      ...previous,
      [itemId]: Number.isNaN(numberValue) ? undefined : numberValue,
    }))
  }

  useEffect(() => {
    const results = resultsRef.current
    if (!results) return

    const observer = new IntersectionObserver(
      ([entry]) => setResultsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )

    observer.observe(results)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <div className="border-b bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50">
        <div className="flex flex-col items-center justify-center space-y-2 py-16">
          <div className="max-w-3xl text-center">
            <h1 className="mb-6 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-6xl">
              Aneurysm Risk Calculator
            </h1>
            <p className="text-balance text-muted-foreground lg:text-lg">
              Calculate overall aneurysm risk, including treatment and conservative rupture risk, using UIATS and PHASES scores.
              UIATS by{" "}
              <a
                className="underline transition-colors hover:text-foreground"
                href="https://www.ncbi.nlm.nih.gov/pubmed/26276380"
                target="_blank"
                rel="noopener noreferrer"
              >
                Etminan et al. 2015
              </a>
              . PHASES by{" "}
              <a
                className="underline transition-colors hover:text-foreground"
                href="https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(13)70263-1/abstract"
                target="_blank"
                rel="noopener noreferrer"
              >
                Greving et al. 2014
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="p-2 pb-20 lg:pb-2">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 sm:px-8 lg:flex-row lg:gap-16">
          <aside className="mt-4 hidden w-[320px] shrink-0 border-r pr-8 lg:block">
            <div className="sticky top-12">
              <ScoreSummary
                uiatsScores={uiatsScores}
                phasesScore={phasesScore}
                isEmpty={isEmpty}
              />
            </div>
          </aside>

          <Questionnaire
            formState={formState}
            onSingleSelect={handleSingleSelect}
            onMultipleSelect={handleMultipleSelect}
            onNumberInput={handleNumberInput}
          />

          <section ref={resultsRef} id="results" className="scroll-mt-6 lg:hidden">
            <ScoreSummary
              uiatsScores={uiatsScores}
              phasesScore={phasesScore}
              isEmpty={isEmpty}
              cardsClassName="grid grid-cols-2 gap-3"
            />
          </section>
        </div>
      </div>

      {!resultsVisible && (
        <a
          href="#results"
          className="fixed bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
        >
          View results
          <ArrowDown className="size-4" />
        </a>
      )}

      <footer className="mt-16 border-t bg-gradient-to-br from-sky-50 via-violet-50 to-rose-50">
        <div className="mx-auto max-w-[1200px] px-8 py-8 text-center text-muted-foreground">
          <p>
            Created with ❤️ by Dr. Marius Vach -{" "}
            <a
              href="https://github.com/vacmar01/aneurysm"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
