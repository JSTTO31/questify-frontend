<template>
  <div>
    <h1 class="mb-10 text-center">{{ question.text }}</h1>
    <v-card
      @click="select(answer.text)"
      class="d-flex align-center my-5 pa-0 font-weight-medium"
      v-for="answer in question.answers"
      :key="answer.id"
      :variant="
        currentAnswer.length < 1 ? 'elevated' : isSelected(answer) ? 'elevated' : 'tonal'
      "
      style="user-select: none"
    >
      <v-col cols="1">
        <v-checkbox
          color="primary"
          :model-value="isSelected(answer)"
          hide-details
        ></v-checkbox>
      </v-col>
      <v-col cols="11">
        {{ answer.text }}
      </v-col>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRespondentStore } from "@/store/respondent";
import useRespondent from "../../../composables/useRespondent";
import { storeToRefs } from "pinia";
const { question } = storeToRefs(useRespondentStore());
const { selectAnswer, currentAnswer, isSelected, removeAnswer } = useRespondent();
const select = (answer: string) => {
  const has = currentAnswer.value.some((item: string) => item == answer);
  if (has) {
    //@ts-ignore
    removeAnswer(question.value.id, answer);
  } else {
    if (currentAnswer.value.length >= Math.ceil(question.value.answers.length / 2)) {
      //@ts-ignore
      removeAnswer(question.value.id, currentAnswer.value[0]);
      //@ts-ignore
      selectAnswer(question.value.id, answer);
    } else {
      //@ts-ignore
      selectAnswer(question.value.id, answer);
    }
  }
};
</script>

<style scoped></style>
