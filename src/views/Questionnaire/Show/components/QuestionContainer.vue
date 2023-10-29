<template>
  <v-container :fluid="name != 'xxl'" class="pt-0">
    <v-card class="px-2 py-5 mb-2">
      <v-textarea
        id="question-text"
        onfocus="this.select()"
        auto-grow
        rows="1"
        hide-details
        label="Question"
        class="font-weight-medium"
        variant="solo"
        flat
        :model-value="selectedQuestion.text"
        @change="($event: any) => update_question(
        {...selectedQuestion, text: $event.target.value})
        "
      >
      </v-textarea>
    </v-card>
    <v-card
      elevation="1"
      style="overflow: visible"
      class="px-5 pr-2 mb-2 pa-3 bg-white d-flex align-center"
      :variant="isSelectedAnswer(answer.index) ? 'tonal' : 'elevated'"
      :color="isSelectedAnswer(answer.index) ? 'success' : ''"
      v-for="answer in selectedQuestion.answers"
      :key="
        //@ts-ignore
        answer.index
      "
    >
      <v-icon color="primary">{{ getCurrentIcon(selectedQuestion.type) }}</v-icon>
      <v-text-field
        class="text-field"
        :model-value="answer.text"
        onfocus="this.select()"
        @change="($event: any) =>
      //@ts-ignore
      update_answer(selectedQuestion.index, {...answer, text: $event.target.value})"
        single-line
        density="compact"
        hide-details
        variant="solo"
        flat
        @keyup.enter="add_answer(selectedQuestion)"
        autofocus
      ></v-text-field>
      <div class="d-flex align-center">
        <v-btn
          class="rounded-0 text-capitalize py-5 d-flex align-center"
          color="success"
          variant="text"
          flat
          size="small"
          prepend-icon="mdi-check"
          @click="add_answer_key(answer.index)"
          v-if="!isSelectedAnswer(answer.index)"
          >Answer</v-btn
        >
        <v-btn
          class="rounded-0 text-capitalize py-5 d-flex align-center"
          variant="text"
          flat
          color="black"
          size="small"
          prepend-icon="mdi-close"
          @click="remove_answer_key(answer.index)"
          v-else
          >Unanswer</v-btn
        >
        <v-btn
          class="rounded-0"
          size="small"
          icon="mdi-trash-can-outline"
          color="error"
          variant="text"
          flat
          @click="
            remove_answer(
              //@ts-ignore
              selectedQuestion.index,
              answer
            )
          "
        ></v-btn>
      </div>
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
import { computed } from "vue";
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
const isSelectedAnswer = computed(() => (index: number | string) =>
  selectedQuestion.value.answer_keys
    ? selectedQuestion.value.answer_keys.some((item) => item == index)
    : false
);

const add_answer_key = (number: number | string) => {
  if (!selectedQuestion.value.answer_keys) {
    //@ts-ignore
    update_question({ ...selectedQuestion.value, answer_keys: [number] });
    return;
  }

  update_question({
    ...selectedQuestion.value,
    //@ts-ignore
    answer_keys: [...selectedQuestion.value.answer_keys, number],
  });
};

const remove_answer_key = (number: number | string) => {
  update_question({
    ...selectedQuestion.value,
    answer_keys: selectedQuestion.value.answer_keys.filter((item) => item != number),
  });
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
