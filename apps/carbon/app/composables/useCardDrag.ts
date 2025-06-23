import type { CardStats } from '../../types'
import { useStore } from '~/stores/useStore'

import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable";
import { checkZoneHit } from '../../utils/cardSwap/zoneHit'

interface useCardDragProps {
  fragElement: HTMLElement | null,
  board: "deck" | "inventory" | null,
  cardIndex: number,
  cardStats: CardStats,
  cardSize: number,
}

export function useCardDrag(props: useCardDragProps) {
  const zones = document.querySelectorAll('[data-dropzone]')
  const store = useStore()

  const {
    moveCardInsideDeck,
    moveCardInsideInventory,
    moveCardFromDeckToInventory,
    moveCardFromInventoryToDeck,
    setHoveredSpace,
    setDraggedCard
  } = store.user

  function onDrag(this: Draggable) {
    props.fragElement?.classList.add("dragging")
    const board = props.board
    if (!board) return
    if (!props.fragElement) return

    setDraggedCard({
      element: props.fragElement,
      originBoard: board,
      cardIndex: props.cardIndex,
      cardStats: props.cardStats,
    })

    checkZoneHit(this, {
      zones: zones,
      mis: (zones) => zones.forEach((zone) => zone.classList.remove("drag-hit")),
      hit: (zones) => {
        zones.forEach((zone) => zone.classList.add("drag-hit"))

        const dropZones = getDropZones(zones);
        const firstZoneAttributes = dropZones[0];
        const lastZoneAttributes = dropZones[zones.length - 1];
        if (!firstZoneAttributes || !lastZoneAttributes) return;
        if (!props.board) return;

        setHoveredSpace({
          size: props.cardSize,
          immigrant: {
            board: firstZoneAttributes.board,
            start: firstZoneAttributes.index,
            end: firstZoneAttributes.index + props.cardSize - 1, // +1 because the end is exclusive
          },
          origin: {
            board: props.board,
            start: props.cardIndex,
            end: props.cardIndex + props.cardSize - 1, // +1 because the end is exclusive
          },
        })
      },
    })
  }

  function onRelease(draggable: Draggable.Vars, cardIndex: number) {
    props.fragElement?.classList.remove("drag")

    setHoveredSpace(null)
    setDraggedCard(null)

    checkZoneHit(draggable, {
      zones: zones,
      mis: landMis,
      hit: (zones) => landHit(zones, draggable, cardIndex),
      dud: (el) => gsap.to(el.target, { duration: 0.5, x: 0, y: 0 }),
    })
  }

  return {
    onDrag,
    onRelease,
  }

  function getDropZones(zones: Element[]) {
    return Array.from(zones).map((zone) => {
      const boardAndId = zone.getAttribute("data-dropzone")
      // Board and ID are described like "deck-0" or "inventory-1". I ned to make an object that contains the board and index as separate properties
      if (!boardAndId) return null;
      const [board, index] = boardAndId.split("-");
      if (!board || !index) return null;
      return {
        board: board as "deck" | "inventory",
        index: parseInt(index),
      };
    }).filter(z => z !== null)
  }

  function landHit(zones: Element[], draggable: Draggable.Vars, cardIndex: number) {
    zones.forEach((zone) => {
      zone.classList.remove("drag-hit")
      zone.classList.add("land-hit")
    })

    const dropZones = getDropZones(zones);

    const firstZone = zones[0];
    const firstZoneAttributes = dropZones[0];
    if (!firstZone || !firstZoneAttributes) return;

    const fromDeck = props.board === "deck"
    const fromInventory = props.board === "inventory"
    const toDeck = firstZoneAttributes.board === "deck"
    const toInventory = firstZoneAttributes.board === "inventory"

    if (fromDeck && toDeck) {
      moveCardInsideDeck({
        index: cardIndex,
        newIndex: firstZoneAttributes.index,
      })
    } else if (fromInventory && toInventory) {
      moveCardInsideInventory({
        index: cardIndex,
        newIndex: firstZoneAttributes.index,
      })
    } else if (fromDeck && toInventory) {
      moveCardFromDeckToInventory({
        deckIndex: cardIndex,
        inventoryIndex: firstZoneAttributes.index,
      })
    } else if (fromInventory && toDeck) {
      moveCardFromInventoryToDeck({
        inventoryIndex: cardIndex,
        deckIndex: firstZoneAttributes.index
      })
    }

    gsap.to(draggable.target, { duration: 0, x: 0, y: 0 })

    // Flip.fit(el.target, firstZone, {
    //   duration: 0.1,
    //   fitWidth: false,
    //   fitHeight: false,
    //   onComplete: () => {
    //     store.user.moveCard({
    //       index: props.index,
    //       newIndex: firstZoneIndex - 1, // Adjust for zero-based index
    //     })
    //     gsap.to(el.target, { duration: 0, x: 0, y: 0 })
    //   },
    // })
  }

  function landMis(zones: Element[]) {
    zones.forEach((zone) => {
      zone.classList.remove("drag-hit")
      zone.classList.remove("land-hit")
    })
  }

}
