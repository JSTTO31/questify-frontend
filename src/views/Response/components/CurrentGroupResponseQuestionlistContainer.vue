<template>
  <div class="pa-0">
    <h1 class="text-subtitle-1 d-flex mb-5">
      <span>{{ index + 1}}. {{ group.group_name }} </span>
      <v-spacer></v-spacer>
    </h1>
    <div class="pl-15 mb-5" v-for="question, n in group.questions" :key="question.id">
      <h1 class="text-subtitle-1 mb-2 d-flex">
        <span>{{ n + 1}}. {{ question.text }} </span>
        <v-spacer></v-spacer>
        <span>{{ getScore(question) }} Points</span>
      </h1>
      <CurrentResponseQuestionList :question="question"></CurrentResponseQuestionList>
      <v-divider class="my-5"></v-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import CurrentResponseQuestionList from './CurrentResponseQuestionList.vue';
import { Question } from '@/store/questionnaire';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const {response, answer_keys} = storeToRefs(useRespondentStore())
const props = defineProps(['group', 'index'])
const getTotal = computed(() => props.group.questions.reduce((sum: number, item: Question) => sum += getScore(item),0))

const getScore = (currentQuestion: Question) => {
  const response_question = response.value.question_responses.find(item => currentQuestion.id == item.question_id)
  const question_answer_keys = answer_keys.value.find(item => item.id == currentQuestion.id)
  if(question_answer_keys && response_question && currentQuestion.auto_check){
    return !question_answer_keys.answer_keys ? 0 : question_answer_keys.answer_keys.filter(answer => response_question.answer_keys.some(item => item == convertToTextAnswer(parseInt(answer), currentQuestion))).length
  }

  return 0
}

const convertToTextAnswer = (index: number, currentQuestion: Question) => {
  return currentQuestion.answers.find(answer => answer.index == index)?.text || ''
}


</script>

<style scoped>

</style>
