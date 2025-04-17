<script setup lang="ts">
import { TabButton } from '@nobel/core'
import { TabsContent, TabsList, TabsRoot } from 'reka-ui'
</script>

<template>
  <TabsRoot
    class="TabsRoot"
    default-value="tab1"
    orientation="horizontal"
  >
    <TabsList
      class="TabsList button-group"
      aria-label="Manage your account"
    >
      <TabButton value="tab1">
        tab1
      </TabButton>
      <TabButton value="tab2">
        tab2
      </TabButton>
    </TabsList>
    <TabsContent value="tab1">
      Make changes to your account here. Click save when you're done.
    </TabsContent>
    <TabsContent value="tab2">
      Change your password here. After saving, you'll be logged out.
    </TabsContent>
  </TabsRoot>
</template>

<style>
.TabsList {
    display: flex;
    align-items: center;
}
</style>
