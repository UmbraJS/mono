<script setup lang="ts">
import ActConclusion from './ActConclusion.vue';
</script>

<template>
  <ActConclusion title="Act 1: Conclusion" :conclusion="[
    { text: 'The music is not in the notes, but in the silence between.', author: 'Mozart' },
    { text: 'A design system is the rules of the design, not the design itself.', author: 'Me' }
  ]" />
</template>
