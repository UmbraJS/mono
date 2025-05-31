import { generateCooldownEvent } from "./generateCooldownEvent";
import type { ModifierChunk, OutputChunk } from "./types";

export interface ChainedCooldownEvent {
  baseDuration: number;
  lifetime: number[];
  chunks: OutputChunk[];
}
