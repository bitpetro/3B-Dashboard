
export enum BodyType {
  Protocol = "Protocol Body (Geosphere)",
  Price = "Price Body (Heliosphere)",
  Environment = "Environment Body (Biosphere)"
}

// Replacing simple Red/Amber/Green with scientific severity
export enum HazardLevel {
  Nominal = "Nominal",         // Stable / Green
  Elevated = "Elevated",       // Caution / Amber
  Critical = "Critical",       // Danger / Red
  Cataclysmic = "Cataclysmic"  // Extinction Level / Black
}

export type Polarity = 'positive' | 'negative' | 'neutral';

export type TriviumType = 'Grammar' | 'Logic' | 'Rhetoric';

export interface ConceptualMapping {
    trivium: TriviumType;
    triviumRole: string; // e.g., "The Foundational Structure"
    forceDescription: string; // e.g., "Raw, Foundational Processes"
    earthSystemAnalogy: string; // e.g., "Tectonic Activity"
    analogyDescription: string; // Detailed analogy description
}

export interface Metric {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  description: string;
  hazardLevel: HazardLevel;
  trend: 'intensifying' | 'dissipating' | 'stable';
  isSecondary?: boolean;
  sources?: string[]; // Added for multi-source validation
}

export interface Variable {
  id: string;
  name: string; 
  scientificName: string; // e.g., "Core Geothermal Monitor"
  body: BodyType;
  metrics: Metric[];
  condition: string; // e.g., "Magmatic Uplift", "Solar Flare Class X"
  hazardLevel: HazardLevel;
  polarity: Polarity; // For magnetic circuit modeling
  summary: string;
  conceptual: ConceptualMapping; // New 3B3 Framework Integration
}

export interface FrameworkData {
  timestamp: string;
  bodies: Record<BodyType, Variable[]>;
}