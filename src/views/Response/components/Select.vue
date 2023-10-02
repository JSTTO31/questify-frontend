<template>
  <h1 class="mb-10 text-center">{{ question.text }}</h1>

  <v-card class="text-h1">
    <v-select hide-details density="comfortable" single-line label="Select Answer" @update:model-value="select" :items="question.answers" :model-value="currentAnswer[0]" item-title="text" item-value="text"></v-select>
  </v-card>
</template>

<script setup lang="ts">
import useRespondent from '@/composables/useRespondent';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
const {question} = storeToRefs(useRespondentStore())
const {currentAnswer, selectAnswer, clearAnswer} = useRespondent()
const select = (value: any) => {
  //@ts-ignore
  clearAnswer(question.value.id)
  //@ts-ignore
  selectAnswer(question.value.id, value)

}
</script>

<style scoped>

</style>
