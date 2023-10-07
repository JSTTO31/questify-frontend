<template>
  <v-card
    elevation="1"
    style="overflow: visible"
    class="px-5 pr-2 mb-2 pa-3 bg-white d-flex align-center"
    :key="
      //@ts-ignore
      answer.random_id
    "
  >
    <v-icon color="primary">{{ getCurrentIcon(type) }}</v-icon>
    <v-text-field
      :model-value="answer.text"
      @change="($event: any) =>
    //@ts-ignore
    update_answer(selectedQuestion.id, answer.id, {text: $event.target.value})"
      single-line
      density="compact"
      hide-details
      variant="solo"
      flat
    ></v-text-field>
    <v-btn
      icon="mdi-close"
      flat
      @click="
        remove_answer(
          //@ts-ignore
          selectedQuestion.id,
          answer
        )
      "
    ></v-btn>
  </v-card>
</template>

<script setup lang="ts">
import useQuestionnaire from "@/composables/useQuestionnaire";
import { Answer } from "@/store/questionnaire";
const props = defineProps<{ answer: Answer; type: string }>();
const { remove_answer, getCurrentIcon, update_answer } = useQuestionnaire();
</script>

<style scoped></style>
