export type AugurTier = {
  label: "population" | "blended" | "personal";
  confidence: "low" | "moderate" | "high";
  note: string;
};

export type AugurParsedFood = {
  raw: string;
  matched: string | null;
  recognized: boolean;
  nutrients: {
    category?: string;
    omega3_epa_dha?: number;
    seed_oil_load?: number;
    added_sugar_g?: number;
    processed_score?: number;
    fiber_g?: number;
    protein_g?: number;
  };
};

export type AugurPrediction = {
  input: string;
  symptom: string;
  symptomLabel: string;
  direction: "aggravates" | "relieves";
  lagDays: number;
  intakeLevel: "elevated" | "low";
  prediction: string;
  tier: string;
  confidence: string;
};

export type AugurFlag = {
  level: "warning" | "caution" | "info";
  category: string;
  message: string;
};

export type AugurAllergyWarning = {
  type: "food_allergy" | "pollen_allergy";
  riskLevel: string;
  trigger: string;
  message: string;
  recommendedAction: string;
};

export type AugurRecommendations = {
  tier1_lifestyle_suggestions?: string[];
  tier2_food_substitutions?: Array<{ swap?: string; reason?: string } | string>;
  tier3_otc_supplement_considerations?: Array<{ name?: string; rationale?: string } | string>;
  tier4_physician_escalation_flags?: string[];
  allergy_environment_guidance?: string[];
  predictedInterventionImpact?: string;
};

export type AugurResponse = {
  timestamp: string;
  tier: AugurTier;
  foodsParsed: AugurParsedFood[];
  dailyNutrients: Record<string, number>;
  predictions: AugurPrediction[];
  nutritionFlags: AugurFlag[];
  allergyWarnings: AugurAllergyWarning[];
  recommendations: AugurRecommendations;
  doctorSummary?: {
    headline?: string;
    discussionPoints?: string[];
    [k: string]: unknown;
  };
};
