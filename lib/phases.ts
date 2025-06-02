// PHASES score calculation based on https://radiopaedia.org/articles/phases-risk-prediction-score-1
// Accepts the formState (Record<string, any>) and returns { score: number, risk: string }

import { FormState } from "./types"; // Updated path to FormState

export type PhasesScoreResult = {
  score: number;
  risk: string;
};

// Helper function to get selected values from formState for multiple choice items
function getSelectedRiskFactors(formStateValue: string | string[] | number | undefined): string[] {
  if (Array.isArray(formStateValue)) {
    return formStateValue as string[];
  }
  return [];
}

export function calculatePhasesScore(formState: FormState): PhasesScoreResult {
  let score = 0;
  const selectedRiskFactors = getSelectedRiskFactors(formState.riskFactors);

  // 1. Population (P)
  // PHASES: Japanese +3, Finnish +5. Others 0.
  if (selectedRiskFactors.includes("japanese")) {
    score += 3;
  } else if (selectedRiskFactors.includes("finnish")) {
    score += 5;
  }
  // "na_eur_non_finnish" or unspecified = 0 points for population.

  // 2. Hypertension (H) - 1 point
  if (selectedRiskFactors.includes("hypertension")) {
    score += 1;
  }

  // 3. Age (A) - >=70 years: 1 point
  const ageValue = formState.age as string | undefined;
  if (ageValue === "71-80" || ageValue === ">80") {
    score += 1;
  }

  // 4. Size of Aneurysm (S) - Diameter in mm
  const diameter = formState.maximumDiameter as number | undefined;
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
  const locationValue = formState.location as string | undefined;
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

  // Determine 5-year rupture risk based on total PHASES score
  let risk = "<0.4% (very low)"; // Score 0-2
  if (score >= 3 && score <= 4) risk = "1.5% (low)";
  else if (score >= 5 && score <= 6) risk = "3.2% (moderate)";
  else if (score >= 7 && score <= 8) risk = "6.4% (high)";
  else if (score >= 9 && score <= 10) risk = "12.3% (very high)";
  else if (score >= 11) risk = "17.8% (extremely high)"; // Score 11+

  return { score, risk };
} 