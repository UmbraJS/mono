import type { Card } from "../types/card"
import { simulateTime } from './simulateTime'
import { spaceStore } from "./space/spaceStore";
import type { User, PreSimulationCard } from '../types'

interface SpaceTimeProps {
  player: User;
  opponent: User;
  matchDuration?: number;
}

export type SpaceOutput = Pick<ReturnType<typeof spaceStore>, 'healthLog' | "shieldLog" | "moraleLog">

export function spaceTimeSimulation(props: SpaceTimeProps) {

  const player = spaceStore({
    maxHealth: props.player.characters.reduce((acc, char) => acc + char.maxHealth, 0),
    onAttack: (attackEntry) => {
      opponent.hurt(attackEntry)
    }
  });

  const opponent = spaceStore({
    maxHealth: props.opponent.characters.reduce((acc, char) => acc + char.maxHealth, 0),
    onAttack: (attackEntry) => {
      player.hurt(attackEntry)
    }
  });

  const time = simulateTime({
    opponentDeck: prepareSimDeck(props.opponent.deck),
    playerDeck: prepareSimDeck(props.player.deck),
    onTrigger: ({ card, nextCooldownEnd }) => {
      const isPlayer = card.owner.user === 'player';
      const target = isPlayer ? player : opponent;
      if (!card.cardStats.bash) return;
      target.bash({
        bash: card.cardStats.bash,
        index: card.card.index,
        timestamp: nextCooldownEnd,
        card: card,
      })
    },
    matchCondition: () => {
      const playerIsDead = player.getHealth() <= 0;
      const opponentIsDead = opponent.getHealth() <= 0;
      return playerIsDead || opponentIsDead;
    }
  })

  const space: {
    opponent: SpaceOutput;
    player: SpaceOutput;
  } = {
    player: {
      healthLog: player.healthLog,
      shieldLog: player.shieldLog,
      moraleLog: player.moraleLog,
    },
    opponent: {
      healthLog: opponent.healthLog,
      shieldLog: opponent.shieldLog,
      moraleLog: opponent.moraleLog,
    }
  }

  return {
    time,
    space
  }
}

function prepareSimDeck(deck: Card[]): PreSimulationCard[] {
  return deck.map((card: Card) => ({
    card: card,
    cardStats: card.stats.base,
  }));
}

export type SpaceTimeSimulationOutput = ReturnType<typeof spaceTimeSimulation>;
