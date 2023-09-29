<template>
  <div>
    <h1 class="mb-10 text-center">
      {{ question.text }}
      <span>______</span>
    </h1>

    <v-card flat class="bg-transparent pa-15 rounded-xl border-lg">
      <v-row>
        <v-col cols="4" v-for="answer in question.answers" :key="answer.id">
          <v-card flat class="pa-5">
            {{ answer.text }}
          </v-card>
        </v-col>
      </v-row>
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
