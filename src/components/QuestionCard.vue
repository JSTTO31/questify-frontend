<template>
  <v-card class="pa-5 mb-2">
    <v-textarea auto-grow rows="1" hide-details label="Question" class="font-weight-medium" single-line variant="solo" flat :model-value="selectedQuestion.text" @change="($event: any) => update_question(
      //@ts-ignore
      selectedQuestion.id,
      {...selectedQuestion, text: $event.target.value})
      ">
    </v-textarea>
  </v-card>
  <v-card elevation="1" style="overflow: visible;" class="px-5 pr-2 mb-2 pa-3 bg-white d-flex align-center" v-for="answer in selectedQuestion.answers" :key="
  //@ts-ignore
  answer.random_id">
    <v-icon color="primary">{{ getCurrentIcon(selectedQuestion.type) }}</v-icon>
    <v-text-field :model-value="answer.text" @change="($event: any) =>
    //@ts-ignore
    update_answer(selectedQuestion.id, answer.id, {text: $event.target.value})" single-line density="compact" hide-details variant="solo" flat></v-text-field>
    <v-btn icon="mdi-close" flat @click="remove_answer(
      //@ts-ignore
      selectedQuestion.id, answer)"></v-btn>
  </v-card>
  <v-card class="bg-transparent" flat>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-plus" @click="add_answer(
        //@ts-ignore
        selectedQuestion)" class="text-capitalize">Add Answer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import useQuestionnaire from '@/composables/useQuestionnaire';
import { Question } from '@/store/questionnaire';
defineProps<{selectedQuestion: Question}>()
const {update_question, add_answer, remove_answer, getCurrentIcon, update_answer} = useQuestionnaire()

</script>

<style scoped>

</style>
