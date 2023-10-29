<template>
  <v-card class="pa-5" flat>
    <h3 class="mb-3">
      {{ question.text }}
    </h3>
    <span
      class="pa-1 text-h5 px-10"
      style="border: 2px solid #000; color: #555"
      @dragover.prevent
      @drop="drop"
      v-if="currentAnswer && currentAnswer?.answer_keys.length < 1"
    >
      Drag here
    </span>
    <span
      class="pa-1 text-h5"
      style="border: 2px solid #000"
      @dragover.prevent
      @drop="drop"
      v-if="currentAnswer && currentAnswer?.answer_keys.length > 0"
    >
      {{ currentAnswer.answer_keys[0] }}
    </span>
    <v-row class="d-flex py-5 pt-10 flex-wrap">
      <v-col cols="6" class="pa-2" v-for="answer in question.answers" :key="answer.id">
        <v-list-item
          draggable="true"
          prepend-icon="mdi-drag"
          color="primary"
          class="pa-5 border rounded-0"
          :title="answer.text"
          :active="!!isDrag(answer.text)"
          @dragstart="($event: any) => drag($event, answer.text)"
          @dragend="selected = ''"
        ></v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { Question } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { useRespondentStore } from "@/store/respondent";
import useRespondent from "@/composables/useRespondent";
import { computed } from "vue";
import { ref } from "vue";
const props = defineProps<{ question: Question }>();
const { response } = storeToRefs(useRespondentStore());
const { selectAnswer, clearAnswer } = useRespondent();
const currentAnswer = computed(() =>
  response.value.question_responses.find((item) => item.question_id == props.question.id)
);
const selected = ref("");
const isDrag = computed(() => (answer: string) =>
  selected.value && selected.value == answer
);
const drag = (e: any, value: string) => {
  e.dataTransfer.setData("answer", value);
  selected.value = value;
};
const drop = (e: any) => {
  const answer = e.dataTransfer.getData("answer");

  //@ts-ignore
  clearAnswer(props.question.id);
  //@ts-ignore
  selectAnswer(props.question.id, answer);
};
</script>

<style scoped></style>
