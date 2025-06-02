// Defines shared types used across the application, particularly for form state.

/**
 * Represents the state of the form.
 * Keys are item IDs (e.g., "age", "riskFactors").
 * Values can be a single string (for single-selects like age or location),
 * an array of strings (for multiple-selects like riskFactors or symptoms),
 * a number (for number inputs like maximumDiameter),
 * or undefined if not set.
 */
export type FormState = Record<string, string | string[] | number | undefined>; 