<template>
  <v-card class="pa-5">
    <h3>{{ question.text }}</h3>
    <v-checkbox
      color="primary"
      class="px-0"
      :label="answer.text"
      :value="answer.text"
      v-for="answer in question.answers"
      :key="answer.id"
      hide-details
      v-model="selected"
    ></v-checkbox>
  </v-card>
</template>

<script setup lang="ts">
import { Question } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { useRespondentStore } from "@/store/respondent";
import useRespondent from "@/composables/useRespondent";
import { computed } from "vue";
import { ref, watch } from "vue";
const props = defineProps<{ question: Question }>();
const { response } = storeToRefs(useRespondentStore());
const { selectAnswer, clearAnswer } = useRespondent();
const currentAnswer = computed(() =>
  response.value.question_responses.find((item) => item.question_id == props.question.id)
);
const selected = ref(currentAnswer.value?.answer_keys || []);

watch(
  () => selected.value,
  () => {
    //@ts-ignore
    clearAnswer(props.question.id);

    if (selected.value.length > 0) {
      selected.value.forEach((item) => {
        //@ts-ignore
        selectAnswer(props.question.id, item);
      });
    }
  }
);
</script>

<style scoped></style>
