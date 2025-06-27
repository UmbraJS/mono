<script setup lang="ts">
import {
  Button,
  toast,
  DialogRoot,
  DialogTrigger,
  DialogModal,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@nobel/core'

const { client } = useAuth()

const deleteUser = async () => {
  await client.deleteUser()
  toast.success('User deleted')
}
</script>

<template>
  <ClientOnly>
    <DialogRoot>
      <DialogTrigger asChild>
        <Button size="medium" color="warning"> Delete user </Button>
      </DialogTrigger>

      <DialogModal variant="warning">
        <div class="dialog-warning-title">
          <Icon name="pixelarticons:warning-box" size="2rem" />
          <DialogTitle> Are you sure? </DialogTitle>
        </div>
        <DialogDescription> Deleting this user is irreversible </DialogDescription>
        <DialogClose>
          <Button size="medium" color="warning" @click="deleteUser"> Delete user </Button>
        </DialogClose>
      </DialogModal>
    </DialogRoot>
    <template #fallback>
      <Button size="medium" color="warning"> Delete user </Button>
    </template>
  </ClientOnly>
</template>
