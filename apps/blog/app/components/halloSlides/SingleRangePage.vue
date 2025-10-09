<script setup lang="ts">
import MockPage from './MockPage/MockPageBlank.vue';
</script>

<template>
  <div class="TheWeb">
    <div class="SingleRangePages">
      <div class="SingleRangePage">
        <h3>Only Base Range</h3>
        <MockPage />
      </div>

      <div class="SingleRangePage">
        <h3>Only Accent Range</h3>
        <MockPage class="base-accent" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.SingleRangePages {
  display: flex;
  gap: var(--space-6);
}

.SingleRangePage {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.TheWeb {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
