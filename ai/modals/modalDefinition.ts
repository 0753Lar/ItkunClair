export interface Modal {
  name: string;
  contextLength: number;
  maxInput: number;
  maxOutput: number;
  inputCost: number; // per 1000 tokens
  outputCost: number; // per 1000 tokens
}
