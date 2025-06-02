import type { Card } from "../types/card"
import { simulateTime } from './simulateTime'
import { spaceStore } from "./space/spaceStore";

interface SpaceTimeProps {
  playerDeck: Card[];
  opponentDeck: Card[];
  matchDuration?: number;
}

function spaceTimeSimulation(props: SpaceTimeProps) {

  const player = spaceStore({
    maxHealth: 100,
    onAttack: (attackEntry) => {
      opponent.hurt(attackEntry)
    }
  });

  const opponent = spaceStore({
    maxHealth: 100,
    onAttack: (attackEntry) => {
      player.hurt(attackEntry)
    }
  });

  return simulateTime({
    opponent: {
      deck: props.opponentDeck,
      onTrigger: (triggeredCard) => {
        // Handle opponent triggered card logic here
      }
    },
    player: {
      deck: props.playerDeck,
      onTrigger: (triggeredCard) => {
        // Handle opponent triggered card logic here
      }
    },
    matchCondition: () => {
      const playerIsDead = player.getHealth() <= 0;
      const opponentIsDead = opponent.getHealth() <= 0;
      return playerIsDead || opponentIsDead;
    }
  })
}
