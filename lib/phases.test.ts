import { describe, expect, it } from "vitest"

import { calculatePhasesScore } from "./phases"

describe("calculatePhasesScore", () => {
  it("returns the baseline for an empty form", () => {
    expect(calculatePhasesScore({})).toEqual({ score: 0, risk: "0.4%" })
  })

  describe("population", () => {
    it.each([
      ["na_eur_non_finnish", 0],
      ["japanese", 3],
      ["finnish", 5],
      ["inuit", 0],
    ])("scores %s as %s population points", (population, points) => {
      expect(calculatePhasesScore({ population })).toEqual({
        score: points,
        risk: points <= 2 ? "0.4%" : points === 3 ? "0.7%" : "1.3%",
      })
    })
  })

  describe("hypertension and earlier SAH", () => {
    it.each([
      [["hypertension"], 1],
      [["sah"], 1],
      [["hypertension", "sah"], 2],
    ])("scores %s as %s points", (riskFactors, points) => {
      expect(calculatePhasesScore({ riskFactors })).toEqual({
        score: points,
        risk: "0.4%",
      })
    })
  })

  describe("age", () => {
    it.each([
      [69, 0],
      [70, 1],
      [71, 1],
    ])("scores age %s as %s age points", (age, agePoints) => {
      expect(calculatePhasesScore({ age })).toEqual({
        score: agePoints,
        risk: "0.4%",
      })
    })
  })

  describe("maximum diameter", () => {
    it.each([
      [6.9, 0],
      [7.0, 3],
      [9.9, 3],
      [10.0, 6],
      [19.9, 6],
      [20.0, 10],
    ])("scores %s mm as %s size points", (diameter, points) => {
      expect(calculatePhasesScore({ maximumDiameter: diameter })).toEqual({
        score: points,
        risk: { 0: "0.4%", 3: "0.7%", 6: "1.7%", 10: "5.3%" }[points],
      })
    })
  })

  describe("site", () => {
    it.each([
      ["ica", 0],
      ["mca", 2],
      ["aca", 4],
      ["acom_pcom", 4],
      ["basilar_bifurcation", 4],
      ["vertebral_basilar_other", 4],
      ["posterior_other", 4],
    ])("scores location %s as %s site points", (location, points) => {
      expect(calculatePhasesScore({ location })).toEqual({
        score: points,
        risk: points === 0 ? "0.4%" : points === 2 ? "0.4%" : "0.9%",
      })
    })
  })

  describe("5-year rupture risk", () => {
    it.each([
      [{}, 0, "0.4%"],
      [{ population: "japanese" }, 3, "0.7%"],
      [{ population: "japanese", age: 70 }, 4, "0.9%"],
      [{ population: "finnish" }, 5, "1.3%"],
      [{ population: "finnish", age: 70 }, 6, "1.7%"],
      [{ population: "finnish", age: 70, riskFactors: ["hypertension"] }, 7, "2.4%"],
      [{ population: "finnish", age: 70, riskFactors: ["hypertension", "sah"] }, 8, "3.2%"],
      [{ maximumDiameter: 7, location: "aca", age: 70, riskFactors: ["hypertension"] }, 9, "4.3%"],
      [{ maximumDiameter: 10, location: "aca" }, 10, "5.3%"],
      [{ maximumDiameter: 20, riskFactors: ["hypertension"] }, 11, "7.2%"],
      [{ maximumDiameter: 20, riskFactors: ["hypertension", "sah"] }, 12, "17.8%"],
    ])("reports %s points as a %s 5-year rupture risk", (formState, score, risk) => {
      expect(calculatePhasesScore(formState)).toEqual({ score, risk })
    })
  })

  it("adds points across independent fields", () => {
    expect(calculatePhasesScore({
      population: "japanese",
      age: 70,
      riskFactors: ["hypertension", "sah"],
      maximumDiameter: 10,
      location: "mca",
    })).toEqual({ score: 3 + 1 + 1 + 1 + 6 + 2, risk: "17.8%" })
  })

  it("ignores unknown option values", () => {
    expect(calculatePhasesScore({
      age: "unknown",
      population: "unknown",
      riskFactors: ["unknown"],
      maximumDiameter: undefined,
      location: "unknown",
    })).toEqual({ score: 0, risk: "0.4%" })
  })
})
