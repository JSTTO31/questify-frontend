<template>
  <h1 class="mb-10 text-center">{{ question.text }}</h1>
  <v-card class="rounded-lg">
    <v-textarea
      variant="solo"
      :model-value="currentAnswer[0] || ''"
      flat
      single-line
      rows="15"
      @change="select"
      no-resize
      density="comfortable"
      hide-details
      label="Paragraph..."
    ></v-textarea>
  </v-card>
</template>
<script setup lang="ts">
import useRespondent from "@/composables/useRespondent";
import { useRespondentStore } from "@/store/respondent";
import { storeToRefs } from "pinia";
const { question } = storeToRefs(useRespondentStore());
const { selectAnswer, clearAnswer, currentAnswer } = useRespondent();
const select = (e: any) => {
  if (Object.keys(question).length > 0) {
    //@ts-ignore
    clearAnswer(question.value.id);
    //@ts-ignore
    selectAnswer(question.value.id, e.target.value);
  }
};
</script>
<style scoped></style>
