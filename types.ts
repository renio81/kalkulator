
export enum MaterialType {
  PLYWOOD_HPL = 'Plywood + HPL',
  ALUMINUM_ACP = 'Almunium + ACP',
  HOLLOW_SPANDEX = 'Besi Hollow + Spandex'
}

export interface MaterialConfig {
  name: MaterialType;
  basePrice: number;
  description: string;
}

export interface AdditionalCost {
  id: string;
  name: string;
  amount: number;
  enabled: boolean;
}

export interface EstimationResult {
  baseCost: number;
  additionalCost: number;
  totalCost: number;
  area: number;
  volume: number;
}
