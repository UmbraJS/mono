import type { Card } from "../types/card"
import { simulateTime } from './simulateTime'
import { spaceStore } from "./space/spaceStore";
import type { User, PreSimulationCard } from '../types'

interface SpaceTimeProps {
  playerCharacters: User['characters'];
  opponentCharacters: User['characters'];
  playerDeck: User['deck'];
  opponentDeck: User['deck'];
  matchDuration?: number;
}

export type SpaceOutput = Pick<ReturnType<typeof spaceStore>, 'healthLog' | "shieldLog" | "moraleLog">

export function spaceTimeSimulation(props: SpaceTimeProps) {
  console.log('spaceTimeSimulation', props);

  const player = spaceStore({
    maxHealth: props.playerCharacters.reduce((acc, char) => acc + char.maxHealth, 0),
    onAttack: (attackEntry) => {
      opponent.hurt(attackEntry)
    }
  });

  const opponent = spaceStore({
    maxHealth: props.opponentCharacters.reduce((acc, char) => acc + char.maxHealth, 0),
    onAttack: (attackEntry) => {
      player.hurt(attackEntry)
    }
  });

  const time = simulateTime({
    opponentDeck: prepareSimDeck(props.opponentDeck),
    playerDeck: prepareSimDeck(props.playerDeck),
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
