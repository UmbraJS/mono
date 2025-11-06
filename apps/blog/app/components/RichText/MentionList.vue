<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }

      return false
    },

    upHandler() {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    selectItem(index) {
      const item = this.items[index]

      if (item) {
        this.command({ id: item })
      }
    },
  },
}
</script>

<template>
  <div class="dropdown-menu">
    {{ selectedIndex }}
    <template v-if="items.length">
      <button
        v-for="item in items"
        :key="item"
        :class="{ 'is-selected': index === selectedIndex }"
        @click="selectItem(index)"
      >
        {{ item }}
      </button>
    </template>
    <div v-else class="item">No result</div>
  </div>
</template>

<style lang="scss">
.dropdown-menu {
  background: var(--base-10);
  border: solid var(--border-size) var(--base-60);
  border-radius: var(--radius);
  padding: var(--space-1);

  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
