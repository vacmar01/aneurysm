// PHASES score calculation based on https://flexikon.doccheck.com/de/PHASES-Score
import type { FormState } from "./types";

export type PhasesScoreResult = {
  score: number;
  risk: string;
};

export function calculatePhasesScore(formState: FormState): PhasesScoreResult {
  let score = 0;
  const selectedRiskFactors = formState.riskFactors ?? [];
  const populationValue = formState.population;

  // 1. Population (P)
  // PHASES: Japanese +3, Finnish +5. Others 0.
  if (populationValue === "japanese") {
    score += 3;
  } else if (populationValue === "finnish") {
    score += 5;
  }
  // "na_eur_non_finnish" or unspecified = 0 points for population.

  // 2. Hypertension (H) - 1 point
  if (selectedRiskFactors.includes("hypertension")) {
    score += 1;
  }

  // 3. Age (A) - >=70 years: 1 point
  const ageValue = formState.age;
  if (ageValue !== undefined && ageValue >= 70) {
    score += 1;
  }

  // 4. Size of Aneurysm (S) - Diameter in mm
  const diameter = formState.maximumDiameter;
  if (diameter !== undefined) {
    if (diameter >= 20) score += 10;
    else if (diameter >= 10 && diameter < 20) score += 6;
    else if (diameter >= 7 && diameter < 10) score += 3;
    // <7mm = 0 points
  }

  // 5. Earlier SAH from another aneurysm (E) - 1 point
  if (selectedRiskFactors.includes("sah")) {
    score += 1;
  }

  // 6. Site of Aneurysm (S) - Location
  // PHASES: ICA=0, MCA=2, ACA/PCOM/Posterior (all variants)=4
  const locationValue = formState.location;
  if (locationValue === "mca") {
    score += 2;
  } else if (
    locationValue === "aca" ||
    locationValue === "acom_pcom" ||
    locationValue === "basilar_bifurcation" ||
    locationValue === "vertebral_basilar_other" ||
    locationValue === "posterior_other"
  ) {
    score += 4;
  }
  // "ica" or unspecified = 0 points for site automatically if not matched above.

  // Determine absolute 5-year rupture risk based on total PHASES score.
  const riskByScore: Record<number, string> = {
    0: "0.4%",
    1: "0.4%",
    2: "0.4%",
    3: "0.7%",
    4: "0.9%",
    5: "1.3%",
    6: "1.7%",
    7: "2.4%",
    8: "3.2%",
    9: "4.3%",
    10: "5.3%",
    11: "7.2%",
  };
  const risk = riskByScore[score] ?? "17.8%";

  return { score, risk };
} 