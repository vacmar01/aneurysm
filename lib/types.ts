export type Population =
  | "na_eur_non_finnish"
  | "japanese"
  | "finnish"
  | "inuit"

export type RiskFactor =
  | "sah"
  | "family"
  | "smoker"
  | "hypertension"
  | "pkd"
  | "drug_abuse"
  | "alcohol_abuse"

export type Symptom =
  | "cn_palsy"
  | "mass_effect"
  | "thromboembolic"
  | "seizures"

export type OtherUiatsFactor =
  | "fear_rupture"
  | "multiple_aneurysms"

export type LifeExpectancy = "<5" | "5-10" | ">10"

export type Comorbidity =
  | "dementia"
  | "coagulopathy_thrombosis"
  | "psych_disorders"

export type Morphology =
  | "irregular_lobulated"
  | "hw_ratio_gt_1.6"

export type AneurysmLocation =
  | "basilar_bifurcation"
  | "vertebral_basilar_other"
  | "acom_pcom"
  | "ica"
  | "mca"
  | "aca"
  | "posterior_other"

export type AdditionalFinding =
  | "growth_over_time"
  | "denovo_over_time"
  | "contralateral_stenosis"

export type AneurysmComplexity =
  | "high_complexity"
  | "low_complexity"

export type FormState = {
  age?: number
  population?: Population
  riskFactors?: RiskFactor[]
  symptoms?: Symptom[]
  otherUiatsFactors?: OtherUiatsFactor[]
  lifeExpectancy?: LifeExpectancy
  comorbidity?: Comorbidity[]
  maximumDiameter?: number
  morphology?: Morphology[]
  location?: AneurysmLocation
  additionalFindings?: AdditionalFinding[]
  aneurysmComplexity?: AneurysmComplexity
}

export type FormFieldId = keyof FormState
