<template>
  <v-card class="pa-5 mb-2">
    <v-textarea
      auto-grow
      rows="1"
      hide-details
      label="Question"
      class="font-weight-medium"
      single-line
      variant="solo"
      flat
      :model-value="selectedQuestion.text"
      @change="($event: any) => update_question(
      //@ts-ignore
      selectedQuestion.id,
      {...selectedQuestion, text: $event.target.value})
      "
    >
    </v-textarea>
  </v-card>
  <AnswerCard
    :type="selectedQuestion.type"
    :answer="answer"
    v-for="answer in selectedQuestion.answers"
    :key="answer.index"
  ></AnswerCard>
  <v-card class="bg-transparent" flat>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        prepend-icon="mdi-plus"
        @click="
          add_answer(
            //@ts-ignore
            selectedQuestion
          )
        "
        class="text-capitalize"
        >Add Answer</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import AnswerCard from "./AnswerCard.vue";
import useQuestionnaire from "@/composables/useQuestionnaire";
import { Question } from "@/store/questionnaire";
defineProps<{ selectedQuestion: Question }>();
const {
  update_question,
  add_answer,
  remove_answer,
  getCurrentIcon,
  update_answer,
} = useQuestionnaire();
</script>

<style scoped></style>
