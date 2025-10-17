import type { CardStats } from '../../types'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { checkZoneHit } from '../../utils/cardSwap/zoneHit'

// Register FLIP plugin
gsap.registerPlugin(Flip)

/**
 * Props for useCardDrag composable
 */
export interface CardDragProps {
  fragElement: HTMLElement | null;
  board: 'deck' | 'inventory' | null;
  cardIndex: number;
  cardStats: CardStats;
  cardSize: number;
}

/**
 * Drop zone attributes
 */
interface DropZoneAttributes {
  board: 'deck' | 'inventory';
  index: number;
}

/**
 * useCardDrag composable for handling card drag-and-drop logic
 * @param props CardDragProps
 * @returns onDrag and onRelease handlers
 */
export function useCardDrag(props: CardDragProps) {
  const zones = document.querySelectorAll('[data-dropzone]') as NodeListOf<HTMLElement>;
  const store = useUser();

  const {
    moveCardInsideDeck,
    moveCardInsideInventory,
    moveCardFromDeckToInventory,
    moveCardFromInventoryToDeck,
    setHoveredSpace,
    setDraggedCard
  } = store.user;

  /**
   * Handler for drag event
   * @param draggable Draggable.Vars
   */
  function onDrag(draggable: Draggable.Vars): void {
    if (!props.fragElement || !props.board) return;
    props.fragElement.classList.add('dragging');

    setDraggedCard({
      element: props.fragElement,
      originBoard: props.board,
      cardIndex: props.cardIndex,
      cardStats: props.cardStats,
    });

    checkZoneHit(draggable, {
      zones,
      mis: handleZoneMiss,
      hit: handleZoneHit,
    });
  }

  /**
   * Handler for release event
   * @param draggable Draggable.Vars
   * @param cardIndex number
   */
  function onRelease(draggable: Draggable.Vars, cardIndex: number): void {
    props.fragElement?.classList.remove('dragging');

    checkZoneHit(draggable, {
      zones,
      mis: handleZoneMiss,
      hit: (hitZones) => handleZoneLand(hitZones, draggable, cardIndex),
      dud: handleZoneDud,
    });

    // Reset state after drag completes
    setTimeout(() => {
      setHoveredSpace(null);
      setDraggedCard(null);
    });
  }

  /**
   * Parse a drop zone element into DropZoneAttributes
   */
  function parseDropZone(zone: Element): DropZoneAttributes | null {
    const boardAndId = zone.getAttribute('data-dropzone');
    if (!boardAndId) return null;
    const split = boardAndId.split('-');
    if (split.length !== 2) return null;
    const [board, index] = split;
    if ((board !== 'deck' && board !== 'inventory') || typeof index !== 'string' || isNaN(Number(index))) return null;
    return { board, index: parseInt(index, 10) };
  }

  /**
   * Get all drop zones as DropZoneAttributes[]
   */
  function getDropZones(zones: NodeListOf<HTMLElement> | Element[]): DropZoneAttributes[] {
    return Array.from(zones)
      .map(parseDropZone)
      .filter((z): z is DropZoneAttributes => z !== null);
  }

  /**
   * Handle when zones are hit during drag
   */
  function handleZoneHit(zones: Element[]): void {
    zones.forEach((zone) => zone.classList.add('drag-hit'));
    const dropZones = getDropZones(zones);
    const firstZone = dropZones[0];
    const lastZone = dropZones[dropZones.length - 1];
    if (!firstZone || !lastZone || !props.board) return;

    setHoveredSpace({
      size: props.cardSize,
      immigrant: {
        board: firstZone.board,
        start: firstZone.index,
        end: firstZone.index + props.cardSize - 1, // end is inclusive
      },
      origin: {
        board: props.board,
        start: props.cardIndex,
        end: props.cardIndex + props.cardSize - 1, // end is inclusive
      },
    });
  }

  /**
   * Handle when zones are missed during drag
   */
  function handleZoneMiss(zones: Element[]): void {
    zones.forEach((zone) => {
      zone.classList.remove('drag-hit');
      zone.classList.remove('land-hit');
    });
  }

  /**
   * Handle when a card is dropped on a valid zone
   */
  function handleZoneLand(zones: Element[], draggable: Draggable.Vars, cardIndex: number): void {
    zones.forEach((zone) => {
      zone.classList.remove('drag-hit');
      zone.classList.add('land-hit');
    });

    const dropZones = getDropZones(zones);
    const firstZone = dropZones[0];
    if (!firstZone || !props.board) return;

    const fromDeck = props.board === 'deck';
    const fromInventory = props.board === 'inventory';
    const toDeck = firstZone.board === 'deck';
    const toInventory = firstZone.board === 'inventory';

    function reorganizeCard() {
      if (!firstZone) return;
      if (fromDeck && toDeck) {
        moveCardInsideDeck({
          index: cardIndex,
          newIndex: firstZone.index,
        });
      } else if (fromInventory && toInventory) {
        moveCardInsideInventory({
          index: cardIndex,
          newIndex: firstZone.index,
        });
      } else if (fromDeck && toInventory) {
        moveCardFromDeckToInventory({
          deckIndex: cardIndex,
          inventoryIndex: firstZone.index,
        });
      } else if (fromInventory && toDeck) {
        moveCardFromInventoryToDeck({
          inventoryIndex: cardIndex,
          deckIndex: firstZone.index,
        });
      }
    }

    // Use FLIP to smoothly transition from current position to new DOM position
    // const state = Flip.getState(draggable.target);

    // Reset the draggable transform and update the DOM
    reorganizeCard();
    gsap.set(draggable.target, {
      duration: 0,
      x: 0, y: 0
    });

    // Animate from the old position to the new position
    // Flip.from(state, {
    //   duration: 0.4,
    //   ease: 'power2.out',
    //   targets: draggable.target,
    // });
  }

  /**
   * Handle when a card is dropped on a dud zone
   */
  function handleZoneDud(el: Draggable.Vars): void {
    gsap.to(el.target, { duration: 0.5, x: 0, y: 0 });
  }

  return {
    onDrag,
    onRelease,
  };
}
