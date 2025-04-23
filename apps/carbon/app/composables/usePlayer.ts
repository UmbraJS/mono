import { timestamp } from '@vueuse/core'
import type { CardAction, Character, ReactiveCard, Card, ElementRef, CardEffectMeta } from '../../types'
import { useHealth, useShield, useMorale } from './useBash'
import { gsap } from 'gsap'

interface UsePlayerProps {
  character: Character
  timeline: gsap.core.Timeline
  onAttack: (attack: number, index: number) => void,
}

export function usePlayer({ character, timeline, onAttack }: UsePlayerProps) {
  const health = useHealth(character)
  const shields = useShield()
  const morale = useMorale()

  const deck = getDeck(character, timeline, (card, index) => bash({
    bash: card.bash,
    index: index,
    timestamp: timeline.time(),
    card: card,
  }))


  const deckEffects = computed(() => {
    const effects: CardEffectMeta[] = []
    deck.forEach((entry) => {
      const e = entry.bash.effects
      if (!e || e.length === 0) return
      e.forEach((effect) => {
        effects.push({
          ...effect,
          source: entry.index,
        })
      })
    })
    return effects
  })

  function handleShieldDown(shields: any, attack: number, timestamp: number, index: number) {
    if (shields.shield.value > 0) {
      shields.shieldDown({
        actualChange: attack,
        attemptedChange: attack,
        timestamp: timestamp,
        type: 'attack',
        index: index,
        banter: createBanterObject(),
      })
    }
  }

  function handleHealthDamage(health: any, shieldPierce: number, attack: number, timestamp: number, index: number) {
    if (shieldPierce > 0) {
      health.hurt({
        actualChange: Math.max(0, shieldPierce),
        attemptedChange: attack,
        timestamp: timestamp,
        type: 'attack',
        index: index,
        banter: createBanterObject(),
      })
    }
  }

  function hurt(attack: number, timestamp: number, index: number) {
    const shieldPierce = attack - shields.shield.value
    handleShieldDown(shields, attack, timestamp, index)
    handleHealthDamage(health, shieldPierce, attack, timestamp, index)
  }

  function createBanterObject() {
    return {
      buffs: [],
      debuffs: [],
    }
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
    onAttack(bash.attack, entry.index)
  }

  function handleShieldChange(entry: CardAction) {
    const bash = entry.bash
    if (!bash.shield) return
    shields.shieldUp({
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
    if (bash.heal && health.health.value < character.maxHealth) {
      health.heal({
        actualChange: bash.heal,
        attemptedChange: bash.heal,
        timestamp: entry.timestamp,
        type: 'heal',
        index: entry.index,
        banter: createBanterObject(),
      })
    }
  }

  function bash(entry: CardAction) {
    handleMoraleChange(entry)
    handleAttack(entry)
    handleShieldChange(entry)
    handleHealing(entry)
  }

  return {
    deck,
    deckEffects,
    ...shields,
    ...morale,
    ...health,
    hurt,
    bash,
  }
}

function animateAction(element: ElementRef) {
  if (!element) return
  gsap.to(element, {
    scale: 1,
    y: 60,
    duration: 0.01,
    ease: 'power1.inOut',
    onComplete: () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: 'power1.inOut',
      })
    },
  })
}

function getDeck(character: Character, timeline: gsap.core.Timeline, onCooldown: (card: Card, index: number) => void): ReactiveCard[] {
  return character.deck.map((card, index) => {
    const cardRef = ref<ElementRef>(null);
    const cooldown = ref(100);

    const slow = ref(0);
    const haste = ref(0);

    const baseDuration = card.bash.cooldown;
    let currentTween: GSAPTween;

    const cardTimeline = gsap.timeline();
    timeline.add(cardTimeline, 0);

    function playCooldown(duration?: number, startValue = cooldown.value) {
      if (!duration) return
      currentTween?.kill();
      const newDuration = duration * (startValue / 100);
      if (newDuration === 0) return

      currentTween = gsap.to(cooldown, {
        value: 0,
        duration: newDuration,
        ease: "none",
        onComplete: () => {
          if (!baseDuration) return
          animateAction(cardRef.value);
          onCooldown(card, index);
          playCooldown(baseDuration);
        },
      });

      cardTimeline.add(currentTween, 0);
    }

    // Start initial cooldown
    playCooldown(baseDuration);

    function applyTimeEffect(multiplier: number, effectDuration: number, type: "slow" | "haste") {
      if (!baseDuration) return
      const activeRef = type === "slow" ? slow : haste;
      const otherRef = type === "slow" ? haste : slow;

      activeRef.value = effectDuration;
      otherRef.value = 0; // Can't be both slowed and hasted at once

      // Animate remaining effect time down to 0
      gsap.to(activeRef, {
        value: 0,
        duration: effectDuration,
        ease: "linear",
      });

      // Adjust cooldown speed
      const remaining = cooldown.value;
      const adjustedDuration = baseDuration * (remaining / 100) / multiplier;
      playCooldown(adjustedDuration, remaining);

      // Restore normal speed after effect ends
      gsap.delayedCall(effectDuration, () => {
        const newRemaining = cooldown.value;
        playCooldown(baseDuration * (newRemaining / 100), newRemaining);
      });
    }

    function setSlow(duration: number) {
      applyTimeEffect(0.5, duration, "slow");
    }

    function setHaste(duration: number) {
      applyTimeEffect(2.0, duration, "haste");
    }

    return {
      ...card,
      index,
      cooldown,
      cardTimeline,
      slow,
      haste,
      setSlow,
      setHaste,
      functionRef: (el) => (cardRef.value = el),
    };
  });

}

const cooldownsUntouched = [{
  baseDuration: 1, // Original duration of the entry in seconds
  duration: 1, // Summed duration of all chunks (slow, haste)
  chunks: [
    { type: "base", duration: 1, timestamp: 0, toPercent: 0 },
  ]
}]

const cooldownsUntouchedStartsLater = [{
  baseDuration: 1, // Original duration of the entry in seconds
  duration: 1, // Summed duration of all chunks (slow, haste)
  chunks: [
    { type: "base", duration: 1, timestamp: 2.5, toPercent: 0 },
  ]
}]

const cooldownsSlowed = [{
  baseDuration: 1, // Original duration of the entry in seconds
  duration: 1.4, // Summed duration of all chunks (slow, haste)
  chunks: [
    { type: "base", duration: 0.2, timestamp: 0.4, toPercent: 20 }, // 0.2 of baseDuration (1) is 20%
    { type: "slow", duration: 0.4, timestamp: 0.6, toPercent: 42.86 },
    { type: "base", duration: 0.8, timestamp: 1.0, toPercent: 0 },
  ]
}]

const cooldownsHasted = [{
  baseDuration: 4.0, // Original duration of the entry in seconds
  duration: 3.0, // Summed duration of all chunks (slow, haste)
  chunks: [
    { type: "base", duration: 1.5, timestamp: 0.4, toPercent: 37.5 },
    { type: "haste", duration: 1.0, timestamp: 1.4, toPercent: 62.5 },
    { type: "base", duration: 0.5, timestamp: 2.9, toPercent: 100 },
  ]
}]

const cooldownsOverlappingSlowHaste = [{
  baseDuration: 1, // Original duration of the entry in seconds
  duration: 1.2, // Summed duration of all chunks (slow, haste)
  chunks: [
    { type: "base", duration: 0.2, timestamp: 0.4, toPercent: 16.67 },
    { type: "slow", duration: 0.2, timestamp: 0.6, toPercent: 33.33 },
    { type: "haste", duration: -0.5, timestamp: 0.8, toPercent: 50 },
    { type: "base", duration: 0.8, timestamp: 1.5, toPercent: 100 },
  ]
}]

export type UsePlayerReturn = ReturnType<typeof usePlayer>
