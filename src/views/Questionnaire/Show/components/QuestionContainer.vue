<template>
  <v-container :fluid="name != 'xxl'" class="pt-0">
    <v-card class="px-2 py-5 mb-2">
      <v-textarea
        id="question-text"
        @focus="selectAllText"
        auto-grow
        rows="1"
        hide-details
        label="Question"
        class="font-weight-medium"
        variant="solo"
        flat
        :model-value="selectedQuestion.text"
        @change="($event: any) => update_question(
        //@ts-ignore
        selectedQuestion.index,
        {...selectedQuestion, text: $event.target.value})
        "
      >
      </v-textarea>
    </v-card>
    <v-card
      elevation="1"
      style="overflow: visible"
      class="px-5 pr-2 mb-2 pa-3 bg-white d-flex align-center"
      v-for="answer in selectedQuestion.answers"
      :key="
        //@ts-ignore
        answer.index
      "
    >
      <v-icon color="primary">{{ getCurrentIcon(selectedQuestion.type) }}</v-icon>
      <v-text-field
        :model-value="answer.text"
        @change="($event: any) =>
      //@ts-ignore
      update_answer(selectedQuestion.index, {...answer, text: $event.target.value})"
        single-line
        density="compact"
        hide-details
        variant="solo"
        flat
        @keyup.enter="add_answer(selectedQuestion)"
      ></v-text-field>
      <v-btn
        icon="mdi-close"
        flat
        @click="
          remove_answer(
            //@ts-ignore
            selectedQuestion.index,
            answer
          )
        "
      ></v-btn>
    </v-card>
    <v-card class="bg-transparent" flat>
      <v-card-actions class="px-0">
        <v-btn
          prepend-icon="mdi-plus"
          @click="
            add_answer(
              //@ts-ignore
              selectedQuestion
            )
          "
          class="text-capitalize px-5"
          >Add Answer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import useQuestionnaire from "@/composables/useQuestionnaire";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify/lib/framework.mjs";
const { name } = useDisplay();
const { selectedQuestion } = storeToRefs(useQuestionnaireStore());
const {
  update_question,
  add_answer,
  remove_answer,
  getCurrentIcon,
  update_answer,
} = useQuestionnaire();
const selectAllText = (e: Event) => {
  //@ts-ignore
  document.getElementById("question-text").select();
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.18s linear;
}

.slide-leave-active {
  transition-delay: 0.2s;
}
</style>
