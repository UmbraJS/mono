<script setup lang="ts"></script>

<template>
  <Premises class="inductive">
    <PremisesPremise>
      <p>All men are mortal</p>
    </PremisesPremise>
    <PremisesPremise>
      <p>Socrates is a man</p>
    </PremisesPremise>

    <div class="inductive premises">
      <div class="premise infavor card">
        <p>All men are mortal</p>
      </div>
      <div class="premise inopposition card">
        <p>Socrates is a man</p>
      </div>
    </div>
  </Premises>
</template>
