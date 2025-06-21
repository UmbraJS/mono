import type { SpaceBoards } from "../../app/stores/useStore";

export interface CardPlacementResult {
  index: number;
  size: number;
  board: "deck" | "inventory";
  hit: PlacementAction
}

type PlacementAction = "default" | "shift-left" | "shift-right" | "swap-board" | "rejected"

export function computeCardPlacement(props: {
  index: number;
  size: number;
  board?: "deck" | "inventory";
  availableInventorySpaceToTheRight: number;
  availableDeckSpaceToTheRight: number;
  availableInventorySpace: number;
  avialableDeckSpace: number;
  hoveredSpace: SpaceBoards | null;
}): CardPlacementResult {
  const cardStart = props.index
  const cardEnd = props.index + props.size - 1

  const makeResult = (hit: PlacementAction): CardPlacementResult => ({
    index: props.index,
    size: props.size,
    board: props.board || "deck",
    hit,
  });

  if (!props.hoveredSpace) return makeResult("default");

  const originBoard = props.hoveredSpace.origin.board
  const originStart = props.hoveredSpace.origin.start
  const originEnd = props.hoveredSpace.origin.end
  const hoveredStart = props.hoveredSpace.immigrant.start
  const hoveredEnd = props.hoveredSpace.immigrant.end

  const isOverStart = hoveredStart <= cardStart && hoveredEnd >= cardStart
  const isOverEnd = hoveredStart <= cardEnd && hoveredEnd >= cardEnd
  const isOverBoth = hoveredStart <= cardStart && hoveredEnd >= cardEnd
  const isOver = isOverStart || isOverEnd || isOverBoth

  const isWrapping = hoveredStart <= cardStart && hoveredEnd >= cardEnd
  const identical = hoveredStart === cardStart && hoveredEnd === cardEnd

  // Prevent the dragged card from being counted as being dragged over itself
  const isFromSameBoard = originBoard === props.board
  const isFromSameSpace = originStart <= cardStart && originEnd >= cardEnd
  if (isFromSameBoard && isFromSameSpace) return makeResult("default");

  if (identical) return isSwapping()
  if (isWrapping) return isSwapping()
  if (isOverStart) return shiftRight()
  if (isOverEnd) shiftLeft()
  if (isOver) return isSwapping()

  return makeResult("default");

  // Helper functions for different placement actions

  function shiftRight(): CardPlacementResult {
    const enoughInventorySpaceToTheRight = props.availableInventorySpaceToTheRight > 0
    const enoughDeckSpaceToTheRight = props.availableDeckSpaceToTheRight > 0
    const isOnInventory = props.board === "inventory"
    const isOnDeck = props.board === "deck"

    if (isOnInventory && enoughInventorySpaceToTheRight) {
      return makeResult("shift-right")
    }

    if (isOnDeck && enoughDeckSpaceToTheRight) {
      return makeResult("shift-right")
    }

    return makeResult("swap-board");
  }

  function shiftLeft(): CardPlacementResult {
    const enoughInventorySpaceToTheLeft = hoveredStart > 0 && props.availableInventorySpace > 0
    const enoughDeckSpaceToTheLeft = hoveredStart > 0 && props.avialableDeckSpace > 0
    const isOnInventory = props.board === "inventory"
    const isOnDeck = props.board === "deck"
    if (isOnInventory && enoughInventorySpaceToTheLeft) {
      return makeResult("shift-left");
    }
    if (isOnDeck && enoughDeckSpaceToTheLeft) {
      return makeResult("shift-left");
    }
    return makeResult("swap-board");
  }

  function isSwapping(): CardPlacementResult {
    const enoughInventorySpace = props.availableInventorySpace > 0
    const enoughDeckSpace = props.avialableDeckSpace > 0

    if (!enoughInventorySpace && originBoard === "inventory") {
      return makeResult("shift-left");
    }

    if (!enoughDeckSpace && originBoard === "deck") {
      return makeResult("shift-left");
    }

    return makeResult("swap-board");
  }
}
