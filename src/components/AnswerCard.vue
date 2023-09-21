<template>
  <v-text-field :model-value="answer.text" :prepend-icon="icon" label="Answer" single-line  density="compact" variant="underlined" class="mb-3">
  </v-text-field>
</template>

<script setup lang="ts">
import { Answer } from '@/store/questionnaire';
const props = defineProps<{answer: Answer, icon: string, }>()
</script>

<style scoped>

</style>
