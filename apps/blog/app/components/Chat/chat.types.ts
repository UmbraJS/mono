import type { useFormula } from "@umbrajs/formula";

export interface ChatMessage {
  message: string;
  displayName: string;
  form: ReturnType<typeof useFormula<{
    message: string;
    displayName: string;
  }>>;
}
