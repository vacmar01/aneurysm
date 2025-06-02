import { FormState } from "./types"; // Updated path to FormState

export type UiatsScores = {
  intervention: number;
  conservative: number;
};

// Helper function to get selected values from formState for multiple choice
function getSelectedValues(formStateValue: string | string[] | number | undefined): string[] {
  if (Array.isArray(formStateValue)) {
    return formStateValue as string[];
  }
  return [];
}

export function calculateUiatsScores(formState: FormState): UiatsScores {
  const scores: UiatsScores = { intervention: 0, conservative: 5 };

  // --- Age --- (ID: "age")
  const ageValue = formState.age as string | undefined;
  if (ageValue) {
    const ageMapIntervention: Record<string, number> = {
      "<40": 4, "41-60": 3, "61-70": 2, "71-80": 1, ">80": 0,
    };
    const ageMapConservative: Record<string, number> = {
      "<40": 0, "41-60": 1, "61-70": 3, "71-80": 4, ">80": 5,
    };
    scores.intervention += ageMapIntervention[ageValue] || 0;
    scores.conservative += ageMapConservative[ageValue] || 0;
  }

  // --- Risk Factors --- (ID: "riskFactors", Pro: Intervention)
  const selectedRiskFactors = getSelectedValues(formState.riskFactors);
  const riskFactorPoints: Record<string, number> = {
    "sah": 4,
    "family": 3,
    "japanese": 2,
    "finnish": 2,
    "inuit": 2,
    "smoker": 3,
    "hypertension": 2,
    "pkd": 2,
    "drug_abuse": 2,
    "alcohol_abuse": 1,
  };
  selectedRiskFactors.forEach(rfKey => {
    scores.intervention += riskFactorPoints[rfKey] || 0;
  });

  // --- Symptoms --- (ID: "symptoms", Pro: Intervention)
  const selectedSymptoms = getSelectedValues(formState.symptoms);
  const symptomPoints: Record<string, number> = {
    "cn_palsy": 4, "mass_effect": 4, "thromboembolic": 3, "seizures": 1,
  };
  selectedSymptoms.forEach(symptom => {
    scores.intervention += symptomPoints[symptom] || 0;
  });

  // --- Other UIATS Factors --- (ID: "otherUiatsFactors", Pro: Intervention)
  const selectedOtherFactors = getSelectedValues(formState.otherUiatsFactors);
  const otherFactorPoints: Record<string, number> = {
    "fear_rupture": 2, "multiple_aneurysms": 1,
  };
  selectedOtherFactors.forEach(factor => {
    scores.intervention += otherFactorPoints[factor] || 0;
  });

  // --- Life Expectancy --- (ID: "lifeExpectancy", Pro: Conservative)
  const lifeExpectancyValue = formState.lifeExpectancy as string | undefined;
  if (lifeExpectancyValue) {
    const lifeExpectancyMap: Record<string, number> = {
      "<5": 4, "5-10": 3, ">10": 1,
    };
    scores.conservative += lifeExpectancyMap[lifeExpectancyValue] || 0;
  }

  // --- Comorbidity --- (ID: "comorbidity", Pro: Conservative)
  const selectedComorbidities = getSelectedValues(formState.comorbidity);
  const comorbidityPoints: Record<string, number> = {
    "dementia": 3, "coagulopathy_thrombosis": 2, "psych_disorders": 2,
  };
  selectedComorbidities.forEach(comorbidity => {
    scores.conservative += comorbidityPoints[comorbidity] || 0;
  });

  // --- Maximum Diameter --- (ID: "maximumDiameter")
  const diameter = formState.maximumDiameter as number | undefined;
  if (diameter !== undefined) {
    let interventionScore = 0;
    if (diameter < 3.9) interventionScore = 0;
    else if (diameter <= 6.9) interventionScore = 1;
    else if (diameter <= 12.9) interventionScore = 2;
    else if (diameter <= 24.9) interventionScore = 3;
    else interventionScore = 4;
    scores.intervention += interventionScore;

    let conservativeScore = 0;
    if (diameter < 6) conservativeScore = 0;
    else if (diameter <= 10) conservativeScore = 1;
    else if (diameter <= 20) conservativeScore = 3;
    else conservativeScore = 5;
    scores.conservative += conservativeScore;
  }

  // --- Morphology --- (ID: "morphology", Pro: Intervention)
  const selectedMorphology = getSelectedValues(formState.morphology);
  const morphologyPoints: Record<string, number> = {
    "irregular_lobulated": 3, "hw_ratio_gt_1.6": 1,
  };
  selectedMorphology.forEach(morph => {
    scores.intervention += morphologyPoints[morph] || 0;
  });

  // --- Location --- (ID: "location", Pro: Intervention for UIATS, matching image)
  const locationValue = formState.location as string | undefined;
  if (locationValue) {
    const locationMapIntervention: Record<string, number> = {
      "basilar_bifurcation": 5,
      "vertebral_basilar_other": 4,
      "acom_pcom": 2,
      "ica": 0,
      "mca": 0,
      "aca": 0,
      "posterior_other": 0, // Other posterior not matching specific UIATS high-risk categories
    };
    scores.intervention += locationMapIntervention[locationValue] || 0;
  }

  // --- Additional Findings --- (ID: "additionalFindings", Pro: Intervention)
  const selectedAdditionalFindings = getSelectedValues(formState.additionalFindings);
  const additionalFindingPoints: Record<string, number> = {
    "growth_over_time": 4, "denovo_over_time": 3, "contralateral_stenosis": 1,
  };
  selectedAdditionalFindings.forEach(finding => {
    scores.intervention += additionalFindingPoints[finding] || 0;
  });

  // --- Aneurysm Complexity --- (ID: "aneurysmComplexity", Pro: Conservative)
  const complexityValue = formState.aneurysmComplexity as string | undefined;
  if (complexityValue) {
    const complexityMap: Record<string, number> = {
      "high_complexity": 3, "low_complexity": 0,
    };
    scores.conservative += complexityMap[complexityValue] || 0;
  }

  return scores;
}