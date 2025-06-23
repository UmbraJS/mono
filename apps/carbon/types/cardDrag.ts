import type { CardStats } from './card';

export interface CardSegment {
  id: string;
  start: number;
  end: number;
  size: number; // Optional size for segments that are not empty
  empty: boolean;
}

interface Space {
  start: number
  end: number
}

interface SpaceBoard extends Space {
  board: 'deck' | 'inventory'
}

export interface DraggedCard {
  element: HTMLElement;
  originBoard: 'deck' | 'inventory';
  cardIndex: number;
  cardStats: CardStats
}

export interface SpaceBoards {
  size: number
  origin: SpaceBoard,
  immigrant: SpaceBoard
}



