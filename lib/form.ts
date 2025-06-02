export type FormOption = {
    label: string;
    value: string; // Represents the actual clinical choice, e.g., "<40", "japanese"
}

export type FormItem = {
    id: string;
    label: string;
    description: string;
    type: "single" | "multiple" | "number";
    options: FormOption[];
}

// --- Form Item Definitions ---

export const age: FormItem = {
    id: "age",
    label: "Age",
    description: "The patient's age",
    type: "single",
    options: [
        { label: "< 40 years", value: "<40" },
        { label: "41-60 years", value: "41-60" },
        { label: "61-70 years", value: "61-70" },
        { label: "71-80 years", value: "71-80" },
        { label: "> 80 years", value: ">80" }
    ]
}

export const riskFactors: FormItem = {
    id: "riskFactors",
    label: "Risk Factors",
    description: "The patient's risk factors. Select all that apply.",
    type: "multiple",
    options: [
        { label: "Previous subarachnoid hemorrhage (2nd aneurysm)", value: "sah" },
        { label: "Family disposition", value: "family" },
        { label: "North American or European (non-Finnish)", value: "na_eur_non_finnish" },
        { label: "Japanese", value: "japanese" },
        { label: "Finnish", value: "finnish" },
        { label: "Inuit", value: "inuit" },
        { label: "Smoker", value: "smoker" },
        { label: "Hypertension (systolic blood pressure > 140 mmHg)", value: "hypertension" },
        { label: "Polycystic kidney disease", value: "pkd" },
        { label: "Drug abuse (Cocaine, Amphetamines)", value: "drug_abuse" },
        { label: "Alcohol abuse", value: "alcohol_abuse" }
    ],
}

export const symptoms: FormItem = {
    id: "symptoms",
    label: "Symptoms",
    description: "The patient's symptoms. Select all that apply.",
    type: "multiple",
    options: [
        { label: "Cranial nerve palsy", value: "cn_palsy" },
        { label: "Mass effect", value: "mass_effect" },
        { label: "Thrombembolic event from aneurysm", value: "thromboembolic" },
        { label: "Seizures", value: "seizures" }
    ],
}

export const otherUiatsFactors: FormItem = { // Renamed from 'other' to avoid conflict
    id: "otherUiatsFactors",
    label: "Other UIATS Factors",
    description: "Other information relevant for UIATS. Select all that apply.",
    type: "multiple",
    options: [
        { label: "Fear of rupture", value: "fear_rupture" },
        { label: "Multiple aneurysms", value: "multiple_aneurysms" }
    ],
}

export const lifeExpectancy: FormItem = {
    id: "lifeExpectancy",
    label: "Life Expectancy",
    description: "The patient's life expectancy",
    type: "single",
    options: [
        { label: "< 5 years", value: "<5" },
        { label: "5-10 years", value: "5-10" },
        { label: "> 10 years", value: ">10" }
    ],
}

export const comorbidity: FormItem = {
    id: "comorbidity",
    label: "Comorbidity",
    description: "The patient's comorbidity. Select all that apply.",
    type: "multiple",
    options: [
        { label: "Dementia", value: "dementia" },
        { label: "Coagulopathy, Thrombosis", value: "coagulopathy_thrombosis" },
        { label: "Psychiatric disorders", value: "psych_disorders" }
    ],
}

export const maximumDiameter: FormItem = {
    id: "maximumDiameter",
    label: "Maximum Diameter",
    description: "The maximum diameter of the aneurysm in millimeters",
    type: "number",
    options: [], // No predefined options for number input
}

export const morphology: FormItem = {
    id: "morphology",
    label: "Morphology",
    description: "Morphological features of the aneurysm. Select all that apply.",
    type: "multiple",
    options: [
        { label: "Irregular or lobulated", value: "irregular_lobulated" },
        { label: "Height/Width ratio > 1.6", value: "hw_ratio_gt_1.6" },
    ],
}

export const location: FormItem = {
    id: "location",
    label: "Location",
    description: "Location of the aneurysm. Select the most specific option.",
    type: "single",
    options: [
        // UIATS specific & PHASES mappable
        { label: "Basilar Artery Bifurcation", value: "basilar_bifurcation" }, // UIATS: 5
        { label: "Vertebral or Basilar Artery (not bifurcation)", value: "vertebral_basilar_other" }, // UIATS: 4
        { label: "Anterior or Posterior Communicating Artery (ACOM/PCOM)", value: "acom_pcom" }, // UIATS: 2
        // Other locations relevant for PHASES, 0 for UIATS location points
        { label: "Internal Carotid Artery (ICA)", value: "ica" },
        { label: "Middle Cerebral Artery (MCA)", value: "mca" },
        { label: "Anterior Cerebral Artery (ACA)", value: "aca" },
        { label: "Other Posterior Circulation (e.g., PCA, PICA if not covered above)", value: "posterior_other"}
    ],
}


export const additionalFindings: FormItem = {
    id: "additionalFindings",
    label: "Additional Findings",
    description: "Other risk-relevant vascular findings. Select all that apply.",
    type: "multiple",
    options: [
        { label: "Aneurysm growth over time", value: "growth_over_time" },
        { label: "De novo aneurysm over time", value: "denovo_over_time" },
        { label: "Contralateral arterial stenosis", value: "contralateral_stenosis" },
    ],
}

export const aneurysmComplexity: FormItem = {
    id: "aneurysmComplexity",
    label: "Aneurysm Complexity",
    description: "Assessment of aneurysm treatment complexity",
    type: "single",
    options: [
        { label: "High complexity", value: "high_complexity" },
        { label: "Low complexity", value: "low_complexity" },
    ],
}

export const formItems: FormItem[] = [
    age,
    riskFactors,
    symptoms,
    otherUiatsFactors, // Renamed from 'other'
    lifeExpectancy,
    comorbidity,
    maximumDiameter,
    morphology,
    location,
    additionalFindings,
    aneurysmComplexity,
]; 