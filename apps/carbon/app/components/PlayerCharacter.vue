<script setup lang="ts">
import type { Character } from '~~/types'
import ValueBar from './ValueBar/ValueBar.vue'
import FrostLayer from './FrostLayer.vue'
import CharacterModal from './CharacterModal.vue';
// import { gsap } from 'gsap'

const props = defineProps<{
  reverse: boolean
  characters: Character[]
  health: Ref<number>
  shield: Ref<number>
}>()

const emit = defineEmits<{
  (e: 'characterLoaded', value: HTMLElement): void
}>()

const maxHealth = computed(() => {
  const total = props.characters.reduce((total, character) => {
    const characterMaxHealth = Number.isFinite(character.maxHealth) ? character.maxHealth : 0
    return total + characterMaxHealth
  }, 0)

  // Ensure we return a valid, positive number
  const result = Math.max(1, total)

  // Debug logging to help identify the issue
  if (!Number.isFinite(result) || result > 10000) {
    console.warn('PlayerCharacter: Unusual maxHealth value detected:', {
      result,
      charactersCount: props.characters.length,
      characters: props.characters.map(c => ({ id: c.id, maxHealth: c.maxHealth }))
    })
  }

  return result
})

// Damage number system
interface DamageNumber {
  id: string
  value: number
  type: 'health' | 'shield'
  x: string
  y: string
}

const damageNumbers = ref<DamageNumber[]>([])

// Damage accumulation system for debounced changes
interface DamageAccumulator {
  totalChange: number
  timeout: NodeJS.Timeout | null
}

const healthAccumulator = ref<DamageAccumulator>({ totalChange: 0, timeout: null })
const shieldAccumulator = ref<DamageAccumulator>({ totalChange: 0, timeout: null })

function accumulateDamage(change: number, type: 'health' | 'shield') {
  const accumulator = type === 'health' ? healthAccumulator : shieldAccumulator

  // Add the change to the running total
  accumulator.value.totalChange += change

  // Clear any existing timeout
  if (accumulator.value.timeout) {
    clearTimeout(accumulator.value.timeout)
  }

  // Set a new timeout to create the damage number after changes stop
  accumulator.value.timeout = setTimeout(() => {
    if (accumulator.value.totalChange !== 0) {
      createDamageNumber(accumulator.value.totalChange, type)
      accumulator.value.totalChange = 0
    }
    accumulator.value.timeout = null
  }, 100) // Wait 100ms after last change before showing damage number
}

function createDamageNumber(value: number, type: 'health' | 'shield') {
  if (value === 0) return

  const damageNumber: DamageNumber = {
    id: crypto.randomUUID(),
    value: Math.floor(value),
    type,
    x: `${Math.random() * 80 + 10}%`, // Random position between 10% and 90%
    y: '50%'
  }

  damageNumbers.value.push(damageNumber)

  // Remove the damage number after animation completes
  setTimeout(() => {
    removeDamageNumber(damageNumber.id)
  }, 2000)
}

function removeDamageNumber(id: string) {
  const index = damageNumbers.value.findIndex(d => d.id === id)
  if (index > -1) {
    damageNumbers.value.splice(index, 1)
  }
}

function animateDamageNumber(el: HTMLElement, _damageNumber: DamageNumber) {
  if (!el) return
  // // Set initial state
  // gsap.set(el, {
  //   scale: 0.5,
  //   opacity: 1,
  //   y: 0
  // })

  // // Animate the damage number
  // gsap.timeline()
  //   .to(el, {
  //     scale: 1.2,
  //     opacity: 1,
  //     duration: 0.2,
  //     ease: 'back.out(2)'
  //   })
  //   .to(el, {
  //     scale: 1,
  //     y: -80,
  //     duration: 0.8,
  //     ease: 'power2.out'
  //   }, '-=0.1')
  //   .to(el, {
  //     opacity: 0,
  //     scale: 0.8,
  //     duration: 0.6,
  //     ease: 'power2.in'
  //   }, '-=0.4')
}

// Watch for health changes
watch(() => props.health.value, (newValue, oldValue) => {
  if (oldValue === undefined) return
  const change = newValue - oldValue
  if (change === 0) return
  console.log('REX: Health change detected:', { newValue, oldValue, change })
  accumulateDamage(change, 'health')
})

// Watch for shield changes
watch(() => props.shield.value, (newValue, oldValue) => {
  if (oldValue === undefined) return
  const change = newValue - oldValue
  if (change === 0) return
  accumulateDamage(change, 'shield')
})

// Cleanup timeouts when component unmounts
onUnmounted(() => {
  if (healthAccumulator.value.timeout) {
    clearTimeout(healthAccumulator.value.timeout)
  }
  if (shieldAccumulator.value.timeout) {
    clearTimeout(shieldAccumulator.value.timeout)
  }
})

// const splinesStore = useSplinesStore()

function functionRef(el: HTMLElement | null) {
  if (!el) return
  emit('characterLoaded', el);
  // if (splinesStore.player.tankCharacter) return
  // splinesStore.player.addTank(el);
}
</script>

<template>
  <section class="character" :class="{ reverse }">
    <header id="Party">
      <CharacterModal v-for="(c) in [0, 1, 2]" :key="c" :character="characters[c]">
        <div id="CharacterAvatarWrapper" :ref="(el) => functionRef(el as HTMLElement)"
          class="border base-accent button buttonText buttonHover buttonActive buttonFocus focus"
          :class="{ TankCharacter: c === 0 }">
          <NuxtImg v-if="characters[c] && characters[c].image" id="CharacterImage" :src="characters[c].image.default"
            alt="Character Image" placeholder />
          <Icon v-else name="pixelarticons:user" size="25" />
        </div>
      </CharacterModal>
      <div class="healthImpact">
        <FrostLayer :reversed="reverse" :health="health.value" :max-health="maxHealth" />
      </div>
    </header>

    <!-- Damage Numbers Container -->
    <div class="damage-numbers">
      <div v-for="damage in damageNumbers" :key="damage.id"
        :ref="(el) => el && animateDamageNumber(el as HTMLElement, damage)" class="damage-number"
        :class="[damage.type, damage.value > 0 ? 'heal' : 'damage']">
        {{ damage.value > 0 ? '+' : '-' }}{{ Math.abs(damage.value) }}
      </div>
    </div>

    <ValueBar :value="shield.value" :max-value="Math.max(maxHealth, shield.value)" bar-color="var(--info-90)"
      delay-color="var(--info-50)" grid-area="shield">
      {{ Math.floor(shield.value) }}
    </ValueBar>

    <ValueBar :value="health.value" :max-value="maxHealth" bar-color="var(--success-50)" delay-color="var(--warning-50)"
      grid-area="health">
      {{ Math.floor(health.value) }} / {{ maxHealth }}
    </ValueBar>
  </section>
</template>

<style>
#CharacterAvatarWrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.healthImpact {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  overflow: hidden;
  z-index: 1;
  display: grid;
  overflow: hidden;
  pointer-events: none;
}

.damage-numbers {
  position: absolute;
  display: flex;
  gap: var(--space-1);
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}

.damage-number {
  font-weight: 900;
  font-size: 1.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 10;
  pointer-events: none;
  /* transform: translate(-50%, -50%); */
}

.damage-number.health.damage {
  color: var(--warning-100);
}

.damage-number.health.heal {
  color: var(--success-100);
}

.damage-number.shield.damage {
  color: var(--info-100);
}

.damage-number.shield.heal {
  color: var(--info-100);
}

#Party {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-1);
  grid-area: avatar;
  padding: var(--space-quark);
}

.character {
  display: grid;
  gap: var(--space-quark);
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'avatar'
    'health'
    'shield';
  position: relative;

  height: 100%;
  width: 100%;
  max-width: 700px;
}

.character.reverse {
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'shield'
    'health'
    'avatar';
}

.character header {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-area: avatar;
  background: var(--base-10);
  border-radius: var(--radius);
  overflow: hidden;
}

#CharacterModalTrigger {
  position: s;
  width: 100%;
  height: 100%;
  background-color: red;
}

#CharacterImage {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius);
  overflow: hidden;
}
</style>
