<template>
  <v-list-item class="rounded-lg bg-white pa-2" @click="$router.push({name: 'response.question', params: {question_id: question.id}})">
    <template #append>
      <v-icon :color="color">{{ icon }}</v-icon>
    </template>
    <v-card-title class="text-subtitle-2">{{index + 1}}. {{ question.text }}</v-card-title>
  </v-list-item>
</template>

<script setup lang="ts">
import { Question } from '@/store/questionnaire';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
const {response, } = storeToRefs(useRespondentStore())
const question_response = response.value.question_responses.find(item => item.question_id == props.question.id)
const props = defineProps<{question: Question, index: number}>()
const icon = question_response?.marked ? 'mdi-lightbulb' : !question_response?.answer_id ? 'mdi-reload' : 'mdi-check'
const color = question_response?.marked ? 'warning' : !question_response?.answer_id ? 'grey' : 'success'
</script>

<style scoped>

</style>
