import { describe, expect, it } from "vitest"

import { calculatePhasesScore } from "./phases"

describe("calculatePhasesScore", () => {
  it.each([
    [69, 0],
    [70, 1],
    [71, 1],
  ])("scores age %s as %s age points", (age, agePoints) => {
    expect(calculatePhasesScore({ age })).toEqual({
      score: agePoints,
      risk: "<0.4% (very low)",
    })
  })
})
