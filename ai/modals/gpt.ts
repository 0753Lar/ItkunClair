import { Modal } from "./modalDefinition";

export const gpt35Turbo: Modal = {
  name: "gpt-3.5-turbo",
  contextLength: 16_385,
  maxInput: 16_385,
  maxOutput: 4_096,
};
