import type { Card } from "../types/card"
import { simulateTime } from './simulateTime'
import { spaceStore } from "./space/spaceStore";
import type { User } from '../types'

interface SpaceTimeProps {
  player: User;
  opponent: User;
  matchDuration?: number;
}

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

  return simulateTime({
    opponentDeck: props.opponent.deck.map((card: Card) => ({
      index: card.index,
      stats: card.stats.base,
    })),
    playerDeck: props.player.deck.map((card: Card) => ({
      index: card.index,
      stats: card.stats.base,
    })),
    onTrigger: ({ card, totalLifetime }) => {
      const isPlayer = card.owner.user === 'player';
      isPlayer
        ? player.bash({
          bash: card.stats.bash,
          index: card.index,
          timestamp: totalLifetime,
          card: card,
        }) :
        opponent.bash({
          bash: card.stats.bash,
          index: card.index,
          timestamp: totalLifetime,
          card: card,
        });
    },
    matchCondition: () => {
      const playerIsDead = player.getHealth() <= 0;
      const opponentIsDead = opponent.getHealth() <= 0;
      return playerIsDead || opponentIsDead;
    }
  })
}
