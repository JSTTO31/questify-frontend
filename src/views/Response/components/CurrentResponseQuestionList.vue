<template>
  <v-list class="pa-0">

    <div v-if="currentResponse && currentResponse.answer_keys.length < 1">
      <v-alert variant="tonal" color="error" class="pa-4" icon="mdi-close">No Selected Item</v-alert >
    </div>
    <div v-else>
      <v-alert
        variant="tonal"
        :color="!question.auto_check ? 'grey-darken-3' : status(answer) == 'correct' ? 'success' : status(answer) == 'wrong' ? 'error' : 'grey-darken-3'"
        :icon="!question.auto_check ? 'mdi-reload' : status(answer) == 'correct' ? 'mdi-check' : status(answer) == 'wrong' ? 'mdi-close' : 'mdi-reload'"
        class="pa-4 mb-2" v-for="answer in currentResponse.answer_keys" :key="answer">
        {{ answer }}
      </v-alert>
    </div>
    <div v-if="getRightAnswers" class="mt-2">
      <h5>Answers:</h5>
      <div v-for="answer in getRightAnswers" :key="answerCovertText(parseInt(answer))">
        <v-alert icon="mdi-check" variant="tonal" color="success" class="pa-4 mb-2">
            {{ answerCovertText(parseInt(answer)) }}
        </v-alert >
      </div>
    </div>
  </v-list>
</template>

<script setup lang="ts">
import { Question } from '@/store/questionnaire';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const {response, questionnaire, answer_keys} = storeToRefs(useRespondentStore())
const props = defineProps<{question: Question}>()
const currentResponse = computed(() => {
  const currentResponse : any = response.value.question_responses.find(item => item.question_id == props.question.id)
  return currentResponse
})


const getRightAnswers = computed(() =>
  answer_keys.value.find(item => item.id == props.question.id)?.answer_keys || null
)

const answerCovertText = (index: number) => {
  return questionnaire.value.questions.find(item => item.id == props.question.id)?.answers.find(answer => answer.index == index)?.text || '';
}
const status = (answer: string) => {
  return !getRightAnswers.value ? 'pending' : getRightAnswers.value.some(item => answerCovertText(parseInt(item)) == answer) ? 'correct' : 'wrong'
}
</script>

<style scoped>

</style>
