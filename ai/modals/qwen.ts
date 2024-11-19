import { Modal } from "./modalDefinition";

export const qwenLong: Modal = {
  name: "qwen-long",
  contextLength: 10_000_000,
  maxInput: 10_000_000,
  maxOutput: 6_000,
  inputCost: 0.0005,
  outputCost: 0.002,
};

export const qwenMax: Modal = {
  name: "qwen-max",
  contextLength: 32_768,
  maxInput: 30_720,
  maxOutput: 8_192,
  inputCost: 0.02,
  outputCost: 0.06,
};

export const qwenPlus: Modal = {
  name: "qwen-plus",
  contextLength: 131_072,
  maxInput: 129_024,
  maxOutput: 8_192,
  inputCost: 0.0008,
  outputCost: 0.002,
};

export const qwenTurbo: Modal = {
  name: "qwen-turbo",
  contextLength: 131_072,
  maxInput: 129_024,
  maxOutput: 8_192,
  inputCost: 0.0003,
  outputCost: 0.0006,
};
