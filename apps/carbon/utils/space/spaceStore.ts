import type { CardAction } from '../../types'
import { healthStore } from './healthStore'
import { shieldStore } from './shieldStore'
import { moraleStore } from './moraleStore'

interface AttackEntry {
  attack: number,
  timestamp: number,
  index: number,
}

interface SpaceStoreProps {
  maxHealth: number,
  onAttack: (props: AttackEntry) => void,
}

export function spaceStore({ maxHealth, onAttack }: SpaceStoreProps) {
  const health = healthStore(maxHealth)
  const shield = shieldStore()
  const morale = moraleStore()

  function handleShieldDown(attackEntry: AttackEntry) {
    if (shield.getShield() <= 0) return
    shield.shieldDown({
      actualChange: -attackEntry.attack,
      attemptedChange: -attackEntry.attack,
      timestamp: attackEntry.timestamp,
      type: 'attack',
      index: attackEntry.index,
      banter: createBanterObject(),
    })
  }

  function handleHealthDamage(shieldPierce: number, attackEntry: AttackEntry) {
    if (shieldPierce <= 0) return
    health.hurt({
      actualChange: Math.max(0, shieldPierce),
      attemptedChange: attackEntry.attack,
      timestamp: attackEntry.timestamp,
      type: 'attack',
      index: attackEntry.index,
      banter: createBanterObject(),
    })
  }

  function hurt(attackEntry: AttackEntry) {
    const shieldPierce = attackEntry.attack - shield.getShield()
    handleShieldDown(attackEntry)
    handleHealthDamage(shieldPierce, attackEntry)
  }

  function handleMoraleChange(entry: CardAction) {
    const bash = entry.bash
    if (!bash.banter) return
    morale.banter({
      actualChange: bash.banter,
      attemptedChange: bash.banter,
      timestamp: entry.timestamp,
      index: entry.index,
      type: 'banter',
      banter: createBanterObject(),
    })
  }

  function handleAttack(entry: CardAction) {
    const bash = entry.bash
    if (!bash.attack) return
    onAttack({
      attack: bash.attack,
      timestamp: entry.timestamp,
      index: entry.index,
    })
  }

  function handleShieldChange(entry: CardAction) {
    const bash = entry.bash
    if (!bash.shield) return
    shield.shieldUp({
      actualChange: bash.shield,
      attemptedChange: bash.shield,
      timestamp: entry.timestamp,
      type: 'shield',
      index: entry.index,
      banter: createBanterObject(),
    })
  }

  function handleHealing(entry: CardAction) {
    const bash = entry.bash
    if (!bash.heal || health.getHealth() >= maxHealth) return
    health.heal({
      actualChange: bash.heal,
      attemptedChange: bash.heal,
      timestamp: entry.timestamp,
      type: 'heal',
      index: entry.index,
      banter: createBanterObject(),
    })
  }

  function bash(entry: CardAction) {
    handleMoraleChange(entry)
    handleAttack(entry)
    handleShieldChange(entry)
    handleHealing(entry)
  }

  return {
    healthLog: health.healthLog,
    shieldLog: shield.shieldLog,
    moraleLog: morale.moraleLog,
    getHealth: health.getHealth,
    getShield: shield.getShield,
    getMorale: morale.getMorale,
    hurt,
    bash,
  }
}

function createBanterObject() {
  return {
    buffs: [],
    debuffs: [],
  }
}
