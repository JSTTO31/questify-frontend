<template>
  <v-card class="rounded-lg pa-5 my-3">
    <h4 class="d-flex align-center">
      <span class="mr-2">{{ index + 1 }}. </span>{{ response_question.question.text }}
      <v-spacer></v-spacer>
      <v-chip
        v-if="response_question.status == 'correct'"
        prepend-icon="mdi-check"
        color="success"
        >Correct answer</v-chip
      >
      <v-chip
        v-else-if="response_question.status == 'wrong'"
        prepend-icon="mdi-close"
        color="error"
        >Wrong answer</v-chip
      >
      <v-chip v-else prepend-icon="mdi-reload" color="grey"
        >Waiting for correction</v-chip
      >
    </h4>
    <v-list>
      <v-list-item
        class="py-5"
        :prepend-icon="getCurrentIcon(response_question.question.type)"
        v-for="answer in answers"
        :key="answer.id"
        color="primary"
        :active="isSelected(answer)"
      >
        {{ answer.text }}
      </v-list-item>
      <h5 class="mb-2 mt-5">Answers:</h5>
      <v-list-item
        class="py-5"
        prepend-icon="mdi-check"
        v-for="answer in answer_keys"
        :key="answer"
        color="success"
        active
      >
        {{ answer }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import useQuestionnaire from "@/composables/useQuestionnaire";
import { Answer, useQuestionnaireStore } from "@/store/questionnaire";
import { QuestionResponse } from "@/store/respondent";
import { storeToRefs } from "pinia";
import { computed } from "vue";
const props = defineProps<{ response_question: QuestionResponse; index: number }>();
const { respondent } = storeToRefs(useQuestionnaireStore());
const { getCurrentIcon } = useQuestionnaire();
const answers = computed(() => props.response_question.question.answers);
const isSelected = (answer: Answer): boolean => {
  return props.response_question.answer_keys.some((item) => item == answer.text);
};
const answer_keys = computed(() =>
  //@ts-ignore
  props.response_question.question.answer_keys
    ? props.response_question.question.answer_keys.map(
        (item) =>
          answers.value.find((answer) => answer.index == parseInt(item))?.text || ""
      )
    : []
);
</script>

<style scoped></style>
