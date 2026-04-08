export type ToolCheck = {
  name: string;
  ok: boolean;
  version?: string;
  details?: string;
};

export type SystemCheckResponse = {
  ok: boolean;
  os: string;
  arch: string;
  shell: string;
  node: ToolCheck;
  git: ToolCheck;
  openclaw: ToolCheck;
  recommendedInstallCommand: string;
  recommendedNextSteps: string[];
};
