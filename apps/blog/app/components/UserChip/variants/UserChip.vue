<script setup lang="ts">
import UserChipWrapper from "../UserChipWrapper.vue";
import UserChipTitle from "../UserChipTitle.vue";
import UserChipAvatar from "../UserChipAvatar.vue";

import IdentityTag from '../../IdentityTag.vue'
import type { AuthUser } from '~/app/composables/useAuth'

defineProps<{
  author: AuthUser;
}>();
</script>

<template>
  <UserChipWrapper :color="'var(--base-120)'" class="base-warning">
    <UserChipAvatar />
    <div class="UserChipContent">
      <UserChipTitle :userName="author.name" :userId="author.id" />
      <!-- <div class="MandatoryIdentityFields">
        <IdentityTag v-for="tag in author.indentityTags || []" :key="tag." :identity-tag="tag" />
      </div> -->
    </div>
    <slot />
  </UserChipWrapper>
</template>
