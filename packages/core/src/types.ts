export type StepStatus = "pass" | "warn" | "fail";

export interface StepResult {
  name: string;
  status: StepStatus;
  summary: string;
  details?: string;
  fix?: string;
}

export interface ProviderConfig {
  provider: string;
  model: string;
  baseUrl?: string;
  apiKeyPresent: boolean;
}
