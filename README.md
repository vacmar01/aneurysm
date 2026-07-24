# Aneurysm Risk Calculator

A small, browser-based calculator for exploring two commonly used risk-stratification tools for unruptured intracranial aneurysms:

- **[UIATS](https://pubmed.ncbi.nlm.nih.gov/26276380/)** — compares factors supporting interventional treatment with factors supporting conservative management.
- **[PHASES](https://pubmed.ncbi.nlm.nih.gov/24290159/)** — estimates the absolute five-year risk of aneurysm rupture from population, hypertension, age, aneurysm size, earlier subarachnoid haemorrhage, and site.

The calculator is intended for education and research—not as a substitute for clinical assessment or shared decision-making with a qualified specialist.

## Background and references

- [The unruptured intracranial aneurysm treatment score (UIATS): a multidisciplinary consensus](https://pubmed.ncbi.nlm.nih.gov/26276380/) · [Full text on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4560059/)
- [Development of the PHASES score for prediction of risk of rupture of intracranial aneurysms](https://pubmed.ncbi.nlm.nih.gov/24290159/) · [Publication DOI](https://doi.org/10.1016/S1474-4422(13)70263-1)
- [PHASES risk prediction score](https://radiopaedia.org/articles/phases-risk-prediction-score-1) — Radiopaedia
- [Intracranial aneurysm overview](https://radiopaedia.org/articles/intracranial-aneurysm-overview) — Radiopaedia

## Technical architecture

- **Next.js App Router** application written in **TypeScript**.
- Client-side form state managed with React; scores recalculate as inputs change.
- **Radix UI** primitives provide accessible form controls, with **Tailwind CSS** for styling.
- `lib/form.ts` defines the calculator fields and options.
- `lib/uiats.ts` and `lib/phases.ts` contain the separate scoring implementations.
- `lib/*.test.ts` contains unit tests for the score calculations.
- No backend, database, authentication, or external data service; inputs remain in the browser and are not persisted.

## Getting started

Requirements: Node.js 25 (the project scripts use [`mise`](https://mise.jdx.dev/) to select it).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run test   # Run unit tests
npm run lint   # Check the codebase
npm run build  # Create a production build
npm run start  # Start the production server
```

## Disclaimer

Although the score calculations have unit tests, results should be treated with caution and checked against the original publications. This tool is for educational purposes only, is not a medical device, and must not replace assessment by a qualified healthcare professional.
