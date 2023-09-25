<template>
  <v-list-item  style="user-select: none;" :color="selectedMenuDialog && selectedMenuDialog.index == question.index ? 'blue' : '#FF9B82'" @click="selectedQuestion = question"  :active="selectedQuestion.index == question.index || (selectedMenuDialog && selectedMenuDialog.index == question.index)"
    >
    <template #prepend>
      <span class="font-weight-medium">{{ index + 1}}.</span>
    </template>
    <v-card-title  draggable="true" @dragstart="$event =>
      //@ts-ignore
      drag($event, question.index)" class="text-subtitle-1 font-weight-regular">
      {{ question.text }}
    </v-card-title>
  </v-list-item>
</template>

<script setup lang="ts">
import { Question, useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
const {selectedQuestion} = storeToRefs(useQuestionnaireStore())
const props = defineProps<{question: Question, selectedMenuDialog: Question, index: number}>()
const drag = (e: Event, question_index: number) => {
  //@ts-ignore
  e.dataTransfer.setData("question_index", question_index)


}
</script>

<style scoped>

</style>
