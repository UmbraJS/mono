<script setup>
import { Button, ButtonGroup } from '@nobel/core'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
</script>

<template>
  <TabsRoot
    default-value="tab1"
    orientation="vertical"
  >
    <TabsList aria-label="tabs example">
      <ButtonGroup>
        <TabsTrigger value="tab1" :as-child="true">
          <Button>One</Button>
        </TabsTrigger>
        <TabsTrigger value="tab2" :as-child="true">
          <Button>Two</Button>
        </TabsTrigger>
        <TabsTrigger value="tab3" :as-child="true">
          <Button>Three</Button>
        </TabsTrigger>
      </ButtonGroup>
    </TabsList>
    <TabsContent value="tab1">
      Tab one content
    </TabsContent>
    <TabsContent value="tab2">
      Tab two content
    </TabsContent>
    <TabsContent value="tab3">
      Tab three content
    </TabsContent>
  </TabsRoot>
</template>
