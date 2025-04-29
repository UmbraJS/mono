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
      const e = entry.effects
      if (!e || e.length === 0) return
      e.forEach((effect) => {
        effects.push({
          ...effect,
          sourceIndex: entry.index,
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
export type UsePlayerReturn = ReturnType<typeof usePlayer>
