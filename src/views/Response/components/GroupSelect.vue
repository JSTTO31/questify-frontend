<template>
  <v-card class="pa-5">
    <h3>
      {{ question.text }}
    </h3>
    <v-select
      color="primary"
      class="mb-10"
      density="compact"
      label="Select answer"
      :items="question.answers"
      item-value="text"
      item-title="text"
      hide-details
      variant="outlined"
      single-line
      v-model="selected"
    ></v-select>
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
const selected = ref(currentAnswer.value?.answer_keys[0] || null);

watch(
  () => selected.value,
  () => {
    console.log("triggered");

    //@ts-ignore
    clearAnswer(props.question.id);
    //@ts-ignore
    selectAnswer(props.question.id, selected.value);
  }
);
</script>

<style scoped></style>
