<template>
  <div>
    <v-card @click="select(
        //@ts-ignore
        question.id, answer.index)"
        class="d-flex align-center  my-5 pa-2 font-weight-medium"
        v-for="answer in question.answers"
        :key="answer.id"
        :variant="currentAnswer.length < 1 ? 'elevated' : isSelected(answer) ? 'elevated' : 'tonal'"
        style="user-select: none;"
        >
        <v-col cols="1">
          <v-radio color="primary" :model-value="isSelected(answer)"></v-radio>
        </v-col>
        <v-col cols="11">
          {{ answer.text }}
        </v-col>
      </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRespondentStore } from '@/store/respondent';
import useRespondent from '../../../composables/useRespondent'
import { storeToRefs } from 'pinia';
const {question } = storeToRefs(useRespondentStore())
const {selectAnswer, currentAnswer, clearAnswer, isSelected} = useRespondent()
const select = (question_id: number, answer_index: number) => {
  clearAnswer(question_id)
  selectAnswer(question_id, answer_index)
}
</script>

<style scoped>

</style>
