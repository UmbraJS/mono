import type { Card } from '../types/card'
import { simulateTime } from './simulateTime'
import { spaceStore } from './space/spaceStore';
import type { User, PreSimulationCard } from '../types'

interface SpaceTimeProps extends SpaceProps {
  playerDeck: User['deck'];
  opponentDeck: User['deck'];
  matchDuration?: number;
}

interface SpaceProps {
  playerCharacters: User['characters'];
  opponentCharacters: User['characters'];
}

export type SpaceOutput = ReturnType<typeof spaceStore>

export function matchSimulator(props: SpaceTimeProps) {
  const space = simulateSpace(props);

  const time = simulateTime({
    opponentDeck: prepareSimDeck(props.opponentDeck),
    playerDeck: prepareSimDeck(props.playerDeck),
    onTrigger: ({ card, nextCooldownEnd }) => {
      const isPlayer = card.owner.user === 'player';
      const target = isPlayer ? space.player : space.opponent;
      if (!card.cardStats.bash) return;
      target.bash({
        bash: card.cardStats.bash,
        index: card.card.index,
        timestamp: nextCooldownEnd,
        card: card,
      })
    },
    matchCondition: () => {
      const playerIsDead = space.player.getHealth() <= 0;
      const opponentIsDead = space.opponent.getHealth() <= 0;
      return playerIsDead || opponentIsDead;
    }
  })

  return {
    time,
    space: space.space,
  }
}

export function performanceSimulator(props: SpaceTimeProps) {
  const player = spaceStore({
    maxHealth: 3000,
    onAttack: (attackEntry) => opponent.hurt(attackEntry)
  });

  const opponent = spaceStore({
    maxHealth: 3000,
    onAttack: (attackEntry) => player.hurt(attackEntry)
  });

  const space = simulateSpaceWrapper({ player, opponent })

  const time = simulateTime({
    opponentDeck: prepareSimDeck(props.opponentDeck),
    playerDeck: prepareSimDeck(props.playerDeck),
    onTrigger: ({ card, nextCooldownEnd }) => {
      const isPlayer = card.owner.user === 'player';
      const target = isPlayer ? space.player : space.opponent;
      if (!card.cardStats.bash) return;
      target.bash({
        bash: card.cardStats.bash,
        index: card.card.index,
        timestamp: nextCooldownEnd,
        card: card,
      })
    },
    matchCondition: () => {
      const playerIsDead = space.player.getHealth() <= 0;
      const opponentIsDead = space.opponent.getHealth() <= 0;
      return playerIsDead || opponentIsDead;
    }
  })

  return {
    time,
    space: space.space,
  }
}

function simulateSpace(props: SpaceProps) {
  const player = spaceStore({
    maxHealth: props.playerCharacters.reduce((acc, char) => acc + char.maxHealth, 0),
    onAttack: (attackEntry) => opponent.hurt(attackEntry)
  });

  const opponent = spaceStore({
    maxHealth: props.opponentCharacters.reduce((acc, char) => acc + char.maxHealth, 0),
    onAttack: (attackEntry) => player.hurt(attackEntry)
  });

  return simulateSpaceWrapper({ player, opponent })
}

function simulateSpaceWrapper(props: {
  player: SpaceOutput;
  opponent: SpaceOutput;
}) {
  return {
    opponent: props.opponent,
    player: props.player,
    space: {
      player: {
        healthLog: props.player.healthLog,
        shieldLog: props.player.shieldLog,
        moraleLog: props.player.moraleLog,
      },
      opponent: {
        healthLog: props.opponent.healthLog,
        shieldLog: props.opponent.shieldLog,
        moraleLog: props.opponent.moraleLog,
      }
    }
  }
}

function prepareSimDeck(deck: Card[]): PreSimulationCard[] {
  return deck.map((card: Card) => ({
    card: card,
    cardStats: card.stats.base,
  }));
}

export type matchSimulatorOutput = ReturnType<typeof matchSimulator>;
