<template>
  <v-card class="pa-5">
    <h3>
      {{ question.text }}
    </h3>
    <v-text-field
      color="primary"
      class="mb-10"
      density="compact"
      label="Select answer"
      hide-details
      variant="outlined"
      single-line
      :model-value="text"
      @change="($event: any) => select($event.target.value)"
    ></v-text-field>
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
const text = ref(currentAnswer.value?.answer_keys[0] || null);
const select = (value: string) => {
  //@ts-ignore
  clearAnswer(props.question.id);
  if (value) {
    //@ts-ignore
    selectAnswer(props.question.id, value);
  }
};
</script>

<style scoped></style>
