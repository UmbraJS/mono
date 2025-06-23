import {
  shiftCardsOnTheRight,
  shiftCardsOnTheLeft,
  shiftNorm,
} from './cardShifts'

interface CardSegment {
  id: string;
  start: number;
  end: number;
  size: number; // Optional size for segments that are not empty
  empty: boolean;
}

type InsertResult = {
  success: boolean;
  cards: CardSegment[];
};

export function getInsertedCard(
  props: {
    deck: CardSegment[],
    newCard: CardSegment,
    maxSlots: number
  }
): InsertResult {
  console.log("rex debug 1: ")

  if (props.deck.length === 0) {
    if (props.newCard.size > props.maxSlots) {
      return { success: false, cards: props.deck };
    }
    return {
      success: true,
      cards: [{
        ...props.newCard,
        start: 0,
        end: props.newCard.size - 1
      }]
    };
  }

  const newCard = props.newCard;
  const newCardStart = newCard.start;
  const newCardEnd = newCard.end;

  const leftDeck: CardSegment[] = [];
  const rightDeck: CardSegment[] = [];

  for (const card of props.deck) {
    const cardStartsBeforeNewCard = card.start < newCardStart;
    cardStartsBeforeNewCard
      ? leftDeck.push(card)
      : rightDeck.push(card);
  }

  const rightShiftedCards = shiftCardsOnTheRight({
    deck: rightDeck,
    newCardEnd: newCardEnd
  });
  const leftShiftedCards = shiftCardsOnTheLeft({
    deck: leftDeck,
    newCardStart: newCardStart
  });

  const newDeck = [
    ...leftShiftedCards,
    newCard,
    ...rightShiftedCards
  ]

  // Now that we have inserted the new card we can check if the result is invalid for the max slots and reject the entire operation if it is
  const getTheTotalSizeOfNewDeck = newDeck.reduce((acc, card) => acc + card.size, 0)
  if (getTheTotalSizeOfNewDeck > props.maxSlots) {
    return { success: false, cards: props.deck };
  }

  const sortedDeck = shiftNorm({
    deck: newDeck,
    maxBoardSlots: props.maxSlots
  }).sort((a, b) => a.start - b.start);
  return { success: true, cards: sortedDeck };
}

