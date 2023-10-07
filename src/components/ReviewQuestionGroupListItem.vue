<template>
  <v-list-item class="rounded-lg bg-white pa-2" @click="$router.push({name: 'response.question', params: {question_id: currentIndex + 1}})">
    <template #append>
      <v-icon :color="color">{{ icon }}</v-icon>
    </template>

    <v-card-title class="text-subtitle-2">{{index + 1}}. {{
      //@ts-ignore
      question?.group_name || question.text }}</v-card-title>
  </v-list-item>
</template>

<script setup lang="ts">
import { Question } from '@/store/questionnaire';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const {response, questionnaire} = storeToRefs(useRespondentStore())
const question_response = response.value.question_responses.find(item => item.question_id == props.question.id)
const props = defineProps<{question: {group_name: string, questions: Question[]}, index: number}>()
//@ts-ignore
const icon = question_response?.marked ? 'mdi-lightbulb' : question_response.answer_keys.length < 1 ? 'mdi-reload' : 'mdi-check'
//@ts-ignore
const color = question_response?.marked ? 'warning' : question_response.answer_keys.length < 1? 'grey' : 'success'
const currentIndex = computed(() => questionnaire.value.questions.findIndex(item => item.id == question_response?.question_id))




</script>

<style scoped>

</style>
