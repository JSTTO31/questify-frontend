<template>
  <div style="padding-inline: 150px">
    <v-card class="pa-5 rounded-lg">
      <h3 class="font-weight-medium mb-3">Questionnaire Configuration</h3>
      <h5 class="font-weight-regular mb-2">Questionnaire Title</h5>
      <v-text-field
        v-model="questionnaire.title"
        prepend-inner-icon="mdi-text"
        label="Questionnaire Title"
        variant="outlined"
        single-line
      />
      <h5 class="font-weight-regular mb-2">Questionnaire Subtitle</h5>
      <v-text-field
        v-model="questionnaire.subtitle"
        prepend-inner-icon="mdi-text-long"
        style="font-size: 25px"
        variant="outlined"
        single-line
        label="Subtitle"
      />
      <h5 class="font-weight-regular mb-2">Timer</h5>
      <v-text-field
        v-model="questionnaire.time_limit"
        label="Timer"
        prepend-inner-icon="mdi-timer-outline"
        hint="Insert seconds"
        single-line
        variant="outlined"
        inset
      ></v-text-field>
      <h5 class="font-weight-regular mb-2">Passing Score</h5>
      <v-text-field
        v-model="questionnaire.passing_score"
        label="Passing Score"
        prepend-inner-icon="mdi-percent"
        single-line
        variant="outlined"
        inset
      ></v-text-field>
      <h5 class="font-weight-regular mb-2">Limit Generate</h5>
      <v-text-field
        v-model="questionnaire.limit"
        label="Passing Score"
        prepend-inner-icon="mdi-card-multiple"
        single-line
        variant="outlined"
        inset
      ></v-text-field>
      <v-switch
        color="primary"
        v-model="questionnaire.shuffle"
        label="Shuffle Question"
        inset
      ></v-switch>
      <v-switch
        color="primary"
        v-model="questionnaire.accept_responses"
        label="Accept Responses"
        inset
      ></v-switch>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { watch } from "vue";
const $questionnaire = useQuestionnaireStore();
const { questionnaire } = storeToRefs(useQuestionnaireStore());
let timer: any = null;
onMounted(() => {
  watch(questionnaire.value, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("triggered");
      $questionnaire.update(questionnaire.value);
    }, 1000);
  });
});
</script>

<style scoped></style>
