export type ModifierType = 'slow' | 'haste' | 'freeze';

export type ModifierChunk = {
  type: ModifierType;
  duration: number;
  timestamp: number;
  sourceIndex: number;
};

export type OutputChunk = {
  type: 'base' | ModifierType;
  duration: number;
  to: number;
  from: number;
  start: number;
  end: number;
  sourceIndex: number | null;
};
