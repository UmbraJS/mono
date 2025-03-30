<script setup lang="ts">
import { useGameStore } from '../composables/useGameStore'
const { gameState, startNewGame } = useGameStore()
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-4xl mx-auto">
      <header class="flex justify-between items-center mb-8">
        <div class="space-y-1">
          <h1 class="text-2xl font-bold">
            Day {{ gameState.currentDay }} - Hour {{ gameState.currentHour }}
          </h1>
          <p class="text-gray-400">Build your deck, fight enemies, survive!</p>
        </div>
        <button
          @click="startNewGame"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          New Game
        </button>
      </header>

      <div class="grid grid-cols-2 gap-4">
        <!-- Player Stats -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-4">Player Stats</h2>
          <div class="space-y-2">
            <p>Health: {{ gameState.player.health }}/{{ gameState.player.maxHealth }}</p>
            <p>Money: ${{ gameState.player.money }} (+{{ gameState.player.interest }})</p>
            <p>Endurance: {{ gameState.player.endurance }}/{{ gameState.maxEndurance }}</p>
            <p>Level: {{ gameState.player.level }} (XP: {{ gameState.player.experience }} / 200)</p>
          </div>
        </div>

        <!-- Deck Overview -->
        <div class="bg-gray-800 rounded-lg p-4">
          <h2 class="text-xl font-semibold mb-4">
            Your Deck ({{ gameState.player.deck.length }} cards)
          </h2>
          <!-- Add deck visualization here -->
        </div>
      </div>
    </div>
  </div>
</template>
