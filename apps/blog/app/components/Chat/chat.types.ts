import type { useFormula } from "@umbrajs/formula";

export interface ChatMessage {
  message: string;
  form: ReturnType<typeof useFormula<{
    message: string;
  }>>;
}
