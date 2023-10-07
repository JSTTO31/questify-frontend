<template>
  <component :is="GroupMultipleChoicesVue" :question="question" class="border-b rounded-0"></component>
</template>

<script setup lang="ts">
import { Question } from '@/store/questionnaire';
import GroupMultipleChoicesVue from './GroupMultipleChoices.vue';
const props = defineProps<{question: Question}>()
</script>

<style scoped>

</style>
