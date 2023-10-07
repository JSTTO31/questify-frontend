<template>
  <v-card class="my-4 rounded-lg pa-8">
    <div class="d-flex mb-2 align-start">
      <h4>{{ index + 1 + ".  " + question.text }}</h4>
      <v-spacer></v-spacer>
    </div>
    <v-card class="pa-15" flat>
      <PieChart
        id="chart"
        :labels="answers(question).labels"
        :datasets="answers(question).data"
      ></PieChart>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import PieChart from "@/components/Charts/PieChart.vue";
import { Question } from "@/store/questionnaire";
import { computed } from "vue";
import { ref } from "vue";
const props = defineProps<{ question: Question; index: number }>();
const copied = ref(false);
const copy = () => {
  const chart = document.getElementById("chart");
  if (chart) {
    //@ts-ignore
    chart.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]).then(() => {
        copied.value = true;
      });
    }, "image/png");
  }
};
const answers = computed(() => (question: Question) => {
  const labels = question.answers.map((item) => item.text);
  const data = question.answers.map((answer) => {
    if (!question.response_questions) {
      return 0;
    }

    return question.response_questions.reduce(
      (sum, item) => (sum += item.answer_keys.some((key) => key == answer.text) ? 1 : 0),
      0
    );
  });
  return {
    labels,
    data,
  };
});
</script>

<style scoped></style>
