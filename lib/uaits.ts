type Option = {
    label: string;
    value: number;
}

type Item = {
    id: string;
    label: string;
    description: string;
    type: "single" | "multiple";
    options: Option[];
    pro: "intervention" | "conservative";
}

const age: Item =
{
    id: "age",
    label: "Age",
    pro: "intervention",
    description: "The patient's age",
    type: "single",
    options: [
        {
            label: "< 40 years",
            value: 4,
        },
        {
            label: "41-60 years",
            value: 3
        },
        {
            label: "61-70 years",
            value: 2
        },
        {
            label: "71-80 years",
            value: 1
        },
        {
            label: "> 80 years",
            value: 0
        }
    ]
}

const riskFactors: Item = {
    id: "riskFactors",
    label: "Risk Factors",
    pro: "intervention",
    description: "The patient's risk factors",
    type: "multiple",
    options: [
        {
            label: "Previous subarachnoid hemorrhage (2nd aneurysm)",
            value: 4
        },
        {
            label: "Family disposition",
            value: 3
        },
        {
            label: "Japanese, Finish or Inuit",
            value: 2
        },
        {
            label: "Smoker",
            value: 3
        },
        {
            label: "Hypertension (systolic blood pressure > 140 mmHg)",
            value: 2
        },
        {
            label: "Polycystic kidney disease",
            value: 2
        },
        {
            label: "Drug abuse (Cocaine, Amphetamines)",
            value: 2
        },
        {
            label: "Alcohol abuse",
            value: 1
        }
    ],
}

const symptoms: Item = {
    id: "symptoms",
    label: "Symptoms",
    pro: "intervention",
    description: "The patient's symptoms",
    type: "multiple",
    options: [
        {
            label: "Cranial nerve palsy",
            value: 4
        },
        {
            label: "Mass effect",
            value: 4
        },
        {
            label: "Thrombembolic event from aneurysm",
            value: 3
        },
        {
            label: "Seizures",
            value: 1
        }
    ],
}

const other: Item = {
    id: "other",
    label: "Other",
    pro: "intervention",
    description: "Other information",
    type: "multiple",
    options: [
        {
            label: "Fear of rupture",
            value: 2
        },
        {
            label: "Multiple aneurysms",
            value: 1
        }
    ],
}

const lifeExpectancy: Item = {
    id: "lifeExpectancy",
    label: "Life Expectancy",
    pro: "conservative",
    description: "The patient's life expectancy",
    type: "single",
    options: [
        {
            label: "< 5 years",
            value: 4
        },
        {
            label: "5-10 years",
            value: 3
        },
        {
            label: "> 10 years",
            value: 1
        }
    ],
}

const comorbidity: Item = {
    id: "comorbidity",
    label: "Comorbidity",
    pro: "conservative",
    description: "The patient's comorbidity",
    type: "multiple",
    options: [
        {
            label: "Dementia",
            value: 3
        },
        {
            label: "Coagulopathy, Thrombosis",
            value: 2
        },
        {
            label: "Psychiatric disorders",
            value: 2
        }
    ],
}

const maximumDiameter: Item = {
    id: "maximumDiameter",
    label: "Maximum Diameter",
    pro: "intervention",
    description: "The maximum diameter of the aneurysm",
    type: "single",
    options: [
        {
            label: "< 3.9 mm",
            value: 0
        },
        {
            label: "4 - 6.9 mm",
            value: 1
        },
        {
            label: "7 - 12.9 mm",
            value: 2
        },
        {
            label: "13 - 24.9 mm",
            value: 3
        },
        {
            label: ">= 25 mm",
            value: 4
        },
    ],
}

const morphology: Item = {
    id: "morphology",
    label: "Morphology",
    pro: "intervention",
    description: "Morphological features of the aneurysm",
    type: "multiple",
    options: [
        { label: "Irregular or lobulated", value: 3 },
        { label: "Height/Width ratio > 1.6", value: 1 },
    ],
}

const location: Item = {
    id: "location",
    label: "Location",
    pro: "intervention",
    description: "Location of the aneurysm",
    type: "single",
    options: [
        { label: "Basilar bifurcation", value: 5 },
        { label: "A. vertebralis, basilar artery", value: 4 },
        { label: "Anterior or posterior communicating artery", value: 2 },
    ],
}

const additionalFindings: Item = {
    id: "additional",
    label: "Additional Findings",
    pro: "intervention",
    description: "Other risk-relevant vascular findings",
    type: "multiple",
    options: [
        { label: "Aneurysm growth over time", value: 4 },
        { label: "De novo aneurysm over time", value: 3 },
        { label: "Contralateral arterial stenosis", value: 1 },
    ],
}

const ageAsTreatmentRisk: Item = {
    id: "ageTherapyRisk",
    label: "Age (as treatment risk)",
    pro: "conservative",
    description: "Patient age considered as treatment-related risk",
    type: "single",
    options: [
        { label: "< 40 years", value: 0 },
        { label: "41–60 years", value: 1 },
        { label: "61–70 years", value: 3 },
        { label: "71–80 years", value: 4 },
        { label: "> 80 years", value: 5 },
    ],
}

const aneurysmSize: Item = {
    id: "aneurysmSize",
    label: "Aneurysm Size",
    pro: "conservative",
    description: "Maximum aneurysm diameter",
    type: "single",
    options: [
        { label: "< 6 mm", value: 0 },
        { label: "6–10 mm", value: 1 },
        { label: "10.1–20 mm", value: 3 },
        { label: "> 20 mm", value: 5 },
    ],
}

const aneurysmComplexity: Item = {
    id: "aneurysmComplexity",
    label: "Aneurysm Complexity",
    pro: "conservative",
    description: "Assessment of aneurysm treatment complexity",
    type: "single",
    options: [
        { label: "High complexity", value: 3 },
        { label: "Low complexity", value: 0 },
    ],
}

export const uiats: Item[] = [
    age,
    riskFactors,
    symptoms,
    other,
    lifeExpectancy,
    comorbidity,
    maximumDiameter,
    morphology,
    location,
    additionalFindings,
    ageAsTreatmentRisk,
    aneurysmSize,
    aneurysmComplexity,
]