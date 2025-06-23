
interface CardSegment {
  id: string;
  start: number;
  end: number;
  size: number; // Optional size for segments that are not empty
  empty: boolean;
}

export function shiftCardsOnTheRight(props: { deck: CardSegment[], newCardEnd: number }) {
  let previous: CardSegment | null = null;
  function returnCard(card: CardSegment): CardSegment {
    previous = card;
    return card
  }

  return props.deck.map((card) => {
    const prevEnd = previous?.end ?? props.newCardEnd;
    if (card.start > prevEnd + 1) return returnCard(card);
    const newStart = prevEnd + 1;

    return returnCard({
      ...card,
      start: newStart,
      end: newStart + card.size - 1,
    });
  });
}

export function shiftCardsOnTheLeft(props: { deck: CardSegment[], newCardStart: number }) {
  let previous: CardSegment | null = null;
  function returnCard(card: CardSegment): CardSegment {
    previous = card;
    return card
  }

  return props.deck.reverse().map(card => {
    const prevStart = previous?.start ?? props.newCardStart;
    if (card.end + 1 < prevStart) return returnCard(card);
    const newEnd = prevStart - 1;

    return returnCard({
      ...card,
      start: newEnd - card.size + 1,
      end: newEnd,
    });
  }).reverse();
}

export function shiftRight(deck: CardSegment[]) {
  let previous: CardSegment | null = null;
  function returnCard(card: CardSegment): CardSegment {
    previous = card;
    return card;
  }

  return deck.map(card => {
    const prevEnd = previous?.end ? previous?.end + 1 : 0;
    if (card.start > prevEnd) return returnCard(card);
    const shift = prevEnd - card.start;
    const newStart = prevEnd + shift + 1;

    return returnCard({
      ...card,
      start: newStart,
      end: newStart + card.size - 1,
    });
  });
}

export function normalizeNegatives(deck: CardSegment[]) {
  let previous: CardSegment | null = null;
  function returnCard(card: CardSegment): CardSegment {
    previous = card;
    return card
  }

  return deck.map((card) => {
    const prevEnd = previous?.end ? previous?.end + 1 : 0;
    if (card.start > prevEnd) return returnCard(card);
    const newStart = prevEnd

    return returnCard({
      ...card,
      start: newStart,
      end: newStart + card.size - 1,
    });
  });
}

export function normalizeOutOfBounds(props: { deck: CardSegment[], maxBoardSlots: number }) {
  let previous: CardSegment | null = null;
  function returnCard(card: CardSegment): CardSegment {
    previous = card;
    return card
  }

  return props.deck.reverse().map(card => {
    const prevStart = previous?.start ?? props.maxBoardSlots;
    if (card.end + 1 < prevStart) return returnCard(card);
    const newEnd = prevStart - 1;

    return returnCard({
      ...card,
      start: newEnd - card.size + 1,
      end: newEnd,
    });
  }).reverse();
}

export const shiftNorm = (props: { deck: CardSegment[], maxBoardSlots: number }) => {
  const negative = normalizeNegatives(props.deck);
  const outOfBounds = normalizeOutOfBounds({
    deck: negative,
    maxBoardSlots: props.maxBoardSlots
  });

  console.log("rex debug: ", {
    deck: props.deck,
    outOfBounds,
    negative,
  })
  return outOfBounds;
}
