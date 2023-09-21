<template>
  <div class="h-100 w-100 py-10 d-flex flex-column">
    <v-card class="pa-10 rounded-lg">
      <div class="d-flex">
        <div v-if="false">
          <h1>Congratulations! <v-icon color="success">mdi-check-circle</v-icon></h1>
          <p>You've just completed the <strong>{{ questionnaire.title }}</strong></p>
          <p>Well done on your dedication to preparing for your upcoming exam!</p>
          <p>Your commitment to practice is a big step towards success, and we're here to support you every step of the way.</p>
          <p>Keep up the great work, and best of luck with your studies!</p>
          <v-alert type="info"  variant="tonal" class="my-5">
            Please note that you'll need to wait for other participants to complete the questionnaire before we can provide you with the results.
          </v-alert>
          <v-btn disabled class="font-weight-bold px-5" xprepend-icon="mdi-clock" width="150">Result {{ timer }}</v-btn>
        </div>
      </div>
      <div v-if="true">
        <div class="d-flex justify-space-between align-center">
          <h1>Results</h1>
          <a class="bg-secondary px-4 py-2 rounded font-weight-medium text-capitalize text-decoration-none" :href="`http://192.168.100.67:8000/response/${response.id}/result/download`" download="file" v-if="true">Download Result</a>
        </div>
        <div class="d-flex justify-space-between flex-column my-10 align-center">
          <v-progress-circular size="300" :model-value="computeScore.percentage" width="15" class="text-h2">{{ computeScore.percentage.toFixed(2)  }}%</v-progress-circular>
          <div v-if="computeScore.percentage >= 85">
            <h1 class="mt-2 text-center" >Passed exam!</h1>
            <h3 class="text-center font-weight-regular">
              Congratulations on successfully passing the mock exam! Your hard work and dedication have paid off, and we're proud of your achievement
            </h3>
          </div>
          <div v-else>
            <h1 class=" mt-2 text-center" >Failed exam!</h1>
            <h3 class="text-center font-weight-regular">The passing score for the exam was set at 85 percent, unfortunately, you did not meet this threshold.</h3>
          </div>

        </div>
        <h2 class="d-flex justify-space-between mb-3">
          Questions and answers List
          <span class="font-weight-regular text-h6">Scores {{ computeScore.score }}/{{questionnaire.questions.length}}</span>
        </h2>
        <v-card class="pa-5 rounded-lg mb-2 rounded-0 border-b px-0" flat v-for="question, n in questionnaire.questions" :key="question.id">
          <h1 class="text-subtitle-1">
            {{ n + 1}}. {{ question.text }}
          </h1>
          <div>
            <v-card class="mt-2 mr-2 pa-5" variant="tonal" :color="isCorrect(question) ? 'success' : 'error'">
              <v-icon>{{ isCorrect(question) ? 'mdi-check' : 'mdi-close' }}</v-icon>
              {{ getAnswer(question)  }}
            </v-card>
            <v-card class="mt-2 mr-2 pa-5" variant="tonal" color="success" :key="answer" v-for="answer in getRightAnswers(question)">
              <v-icon>mdi-check</v-icon>
              {{ answer.text }}
            </v-card>
          </div>
        </v-card>
      </div>
    </v-card>
    <v-spacer></v-spacer>
    <div class="text-white mt-5 text-center font-weight-medium">
      <p>Thank you for choosing our service. Your satisfaction is important to us.</p>
      <p>We would greatly appreciate your feedback to help us serve you better in the future.</p>
      <div class="mt-5">
        <h1 class="text-center text-white mt-10 font-weight-bold" style="font-size: 40px;font-family: 'Poppins', sans-serif;">
          Questify
        </h1>
        <div class="d-flex justify-center font-weight-regular align-center">
          Powered by Inventive Media OJT
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Question } from '@/store/questionnaire';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { inject } from 'vue';
const timer = inject('timer')
const {questionnaire, response, answer_keys} = storeToRefs(useRespondentStore())
const getAnswer = (question: Question) => {
  const answer_id = response.value.question_responses.find(item => item.question_id == question.id)?.answer_id
  return question.answers.find(item => item.id == answer_id)?.text || 'No Selected Answers'
}
const isCorrect = (question: Question) => {
  //@ts-ignore
  return response.value.question_responses.some(item => item.question_id == question.id && (answer_keys.value[item.answer_id] || false))
}
const getRightAnswers = (question: Question) => {
 return question.answers.filter(item => answer_keys.value[item.id] && !isCorrect(question))
}
const computeScore = computed(() => {
  //@ts-ignore
  const compute = response.value.question_responses.reduce((sum, item) => {
    //@ts-ignore
    const isCorrect = answer_keys.value[item.answer_id] || false
    if(isCorrect){
      sum++
    }
    return sum
  }, 0)

  return {
    percentage: compute / questionnaire.value.questions.length * 100,
    score: compute,
  }
})


</script>

<style scoped>

</style>
