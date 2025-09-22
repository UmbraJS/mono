import type { useFormula } from "../../composables/useForm";

export interface ChatMessage {
  message: string;
  displayName: string;
  form: ReturnType<typeof useFormula<{
    message: string;
    displayName: string;
  }>>;
}
