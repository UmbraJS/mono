import type { Card } from '../types/card'
import { simulateTime } from './simulateTime'
import { spaceStore } from './space/spaceStore';
import type { User, PreSimulationCard } from '../types'

interface SpaceTimeProps extends Decks, Characters {
  matchDuration?: number; // TODO: this is not used currently
}

interface Decks {
  playerDeck: User['deck'];
  opponentDeck: User['deck'];
}

interface Characters {
  playerCharacters: User['characters'];
  opponentCharacters: User['characters'];
}

export type SpaceOutput = ReturnType<typeof spaceStore>

export function matchSimulator(props: SpaceTimeProps) {
  const space = simulateSpace(props);
  const view = useView();

  const time = simulateTime({
    realm: view.realm,
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

export function performanceSimulator(props: Decks) {
  const view = useView();

  const player = spaceStore({
    maxHealth: 3000,
    onAttack: (attackEntry) => opponent.hurt(attackEntry)
  });

  const opponent = spaceStore({
    maxHealth: 0,
    onAttack: (attackEntry) => player.hurt(attackEntry)
  });


  player.hurt({
    attack: 3000,
    timestamp: 0,
    index: 0,
  })

  const space = simulateSpaceWrapper({ player, opponent })

  const time = simulateTime({
    realm: view.realm,
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
    matchCondition: (nextCooldownEnd) => {
      if (nextCooldownEnd > 30) return true;
      return false;
    }
  })

  return {
    time,
    space: space.space,
  }
}

function simulateSpace(props: Characters) {
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
