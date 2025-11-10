<script setup lang="ts">
import type { IdentityTag, IdentityTagPolitics, IdentityTagReligion, IdentityTagGender } from '../../types/profile'

const props = defineProps<{
  identityTag: IdentityTag
}>()
const fallbackIcon = 'carbon:person'

function getIcon() {
  switch (props.identityTag.subject) {
    case 'politics':
      return switchPolitics(props.identityTag)
    case 'religion':
      return religionSwitch(props.identityTag)
    case 'gender':
      return switchGender(props.identityTag)
    default:
      return fallbackIcon
  }
}

function switchGender(tag: IdentityTagGender) {
  switch (tag.name) {
    case 'boy':
      return 'mdi:gender-male'
    case 'girl':
      return 'mdi:gender-female'
    default:
      return fallbackIcon
  }
}

function switchPolitics(tag: IdentityTagPolitics) {
  switch (tag.name) {
    case 'liberal':
      return 'mdi:scale-balance'
    case 'conservative':
      return 'mdi:shield'
    case 'socialist':
      return 'mdi:hammer'
    case 'libertarian':
      return 'mdi:access-point-minus'
    case 'communist':
      return 'mdi:hammer-sickle'
    default:
      return fallbackIcon
  }
}

function religionSwitch(tag: IdentityTagReligion) {
  switch (tag.name) {
    case 'christian':
      return 'mdi:cross'
    case 'muslim':
      return 'mdi:crescent-moon'
    case 'jewish':
      return 'mdi:star-of-david'
    case 'hindu':
      return 'mdi:om'
    case 'buddhist':
      return 'mdi:buddha'
    case 'atheist':
      return 'mdi:atom'
    default:
      return fallbackIcon
  }
}

const icon = getIcon()
</script>

<template>
  <div class="IdentityTag base-accent">
    <Icon class="IdentityIcon" :name="icon" />
    <p class="caption">{{ identityTag.name }}</p>
  </div>
</template>

<style scoped>
.IdentityTag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);

  background-color: var(--base-10);
  color: var(--base-120);
  padding: var(--space-quark) var(--space-2);
  border-radius: var(--radius);
}
</style>
