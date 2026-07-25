import { describe, expect, it } from "vitest"

import {
  calculateUiatsRecommendation,
  calculateUiatsScores,
} from "./uiats"

describe("calculateUiatsScores", () => {
  it("returns the UIATS baseline for an empty form", () => {
    expect(calculateUiatsScores({})).toEqual({
      intervention: 0,
      conservative: 5,
    })
  })

  describe("recommendation", () => {
    it.each([
      [{ intervention: 10, conservative: 10 }, "not-definitive"],
      [{ intervention: 12, conservative: 10 }, "not-definitive"],
      [{ intervention: 13, conservative: 10 }, "interventional"],
      [{ intervention: 10, conservative: 13 }, "conservative"],
    ])("returns %s as %s", (scores, recommendation) => {
      expect(calculateUiatsRecommendation(scores)).toBe(recommendation)
    })
  })

  describe("age", () => {
    it.each([
      [39, 4, 5],
      [40, 3, 6],
      [60, 3, 6],
      [61, 2, 8],
      [70, 2, 8],
      [71, 1, 9],
      [80, 1, 9],
      [81, 0, 10],
    ])("scores age %s as %s intervention and %s conservative points", (age, intervention, conservative) => {
      expect(calculateUiatsScores({ age })).toEqual({ intervention, conservative })
    })
  })

  describe("population", () => {
    it.each([
      ["na_eur_non_finnish", 0],
      ["japanese", 2],
      ["finnish", 2],
      ["inuit", 2],
    ])("scores %s as %s intervention points", (population, points) => {
      expect(calculateUiatsScores({ population })).toEqual({
        intervention: points,
        conservative: 5,
      })
    })
  })

  describe("intervention-related factors", () => {
    it.each([
      ["riskFactors", "sah", 4],
      ["riskFactors", "family", 3],
      ["riskFactors", "smoker", 3],
      ["riskFactors", "hypertension", 2],
      ["riskFactors", "pkd", 2],
      ["riskFactors", "drug_abuse", 2],
      ["riskFactors", "alcohol_abuse", 1],
      ["symptoms", "cn_palsy", 4],
      ["symptoms", "mass_effect", 4],
      ["symptoms", "thromboembolic", 3],
      ["symptoms", "seizures", 1],
      ["otherUiatsFactors", "fear_rupture", 2],
      ["otherUiatsFactors", "multiple_aneurysms", 1],
      ["morphology", "irregular_lobulated", 3],
      ["morphology", "hw_ratio_gt_1.6", 1],
      ["additionalFindings", "growth_over_time", 4],
      ["additionalFindings", "denovo_over_time", 3],
      ["additionalFindings", "contralateral_stenosis", 1],
    ])("scores %s=%s as %s intervention points", (field, value, points) => {
      expect(calculateUiatsScores({ [field]: [value] })).toEqual({
        intervention: points,
        conservative: 5,
      })
    })

    it.each([
      ["basilar_bifurcation", 5],
      ["vertebral_basilar_other", 4],
      ["acom_pcom", 2],
      ["ica", 0],
      ["mca", 0],
      ["aca", 0],
      ["posterior_other", 0],
    ])("scores location %s as %s intervention points", (location, points) => {
      expect(calculateUiatsScores({ location })).toEqual({
        intervention: points,
        conservative: 5,
      })
    })
  })

  describe("conservative-management factors", () => {
    it.each([
      ["<5", 4],
      ["5-10", 3],
      [">10", 1],
    ])("scores life expectancy %s as %s points", (lifeExpectancy, points) => {
      expect(calculateUiatsScores({ lifeExpectancy })).toEqual({
        intervention: 0,
        conservative: 5 + points,
      })
    })

    it.each([
      ["dementia", 3],
      ["coagulopathy_thrombosis", 2],
      ["psych_disorders", 2],
    ])("scores comorbidity %s as %s points", (comorbidity, points) => {
      expect(calculateUiatsScores({ comorbidity: [comorbidity] })).toEqual({
        intervention: 0,
        conservative: 5 + points,
      })
    })

    it.each([
      ["high_complexity", 3],
      ["low_complexity", 0],
    ])("scores aneurysm complexity %s as %s points", (aneurysmComplexity, points) => {
      expect(calculateUiatsScores({ aneurysmComplexity })).toEqual({
        intervention: 0,
        conservative: 5 + points,
      })
    })
  })

  describe("maximum diameter", () => {
    it.each([
      [3.9, 0, 0],
      [4.0, 1, 0],
      [6.9, 1, 1],
      [7.0, 2, 1],
      [10.0, 2, 1],
      [10.1, 2, 3],
      [12.9, 2, 3],
      [13.0, 3, 3],
      [20.0, 3, 3],
      [20.1, 3, 5],
      [24.9, 3, 5],
      [25.0, 4, 5],
    ])("scores %s mm as %s intervention and %s conservative points", (diameter, interventionPoints, conservativePoints) => {
      expect(calculateUiatsScores({ maximumDiameter: diameter })).toEqual({
        intervention: interventionPoints,
        conservative: 5 + conservativePoints,
      })
    })
  })

  it("adds points across independent fields", () => {
    expect(calculateUiatsScores({
      age: 40,
      population: "japanese",
      riskFactors: ["hypertension"],
      symptoms: ["cn_palsy"],
      maximumDiameter: 7.0,
      location: "acom_pcom",
      lifeExpectancy: "5-10",
      morphology: ["irregular_lobulated"],
      aneurysmComplexity: "high_complexity",
    })).toEqual({
      intervention: 3 + 2 + 2 + 4 + 2 + 2 + 3,
      conservative: 5 + 1 + 1 + 3 + 3,
    })
  })

  it("ignores unknown option values", () => {
    expect(calculateUiatsScores({
      age: "unknown",
      population: "unknown",
      riskFactors: ["unknown"],
      symptoms: ["unknown"],
      maximumDiameter: undefined,
      location: "unknown",
    })).toEqual({
      intervention: 0,
      conservative: 5,
    })
  })
})
