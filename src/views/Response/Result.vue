<template>
  <div class="w-100">
    <v-card class="px-10 py-8 my-10 rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <h1>Results</h1>
        <a download="file" id="download"></a>
        <v-btn class="bg-secondary px-4 py-2 rounded font-weight-medium text-capitalize text-decoration-none" @click="download">Download Result</v-btn>
      </div>
      <div class="d-flex justify-space-between flex-column my-10 align-center">
        <v-progress-circular size="300" :model-value="getScorePercentage" width="15" class="text-h2">{{ getScorePercentage.toFixed(2)  }}%</v-progress-circular>
        <div v-if="getScorePercentage >= 85">
          <h1 class="mt-2 text-center" >You passed the exam!</h1>
          <h3 class="text-center font-weight-regular px-15">
            Congratulations on successfully passing the mock exam! Your hard work and dedication have paid off, and we're proud of your achievement
          </h3>
        </div>
        <div v-else>
          <h1 class=" mt-2 text-center" >You failed the exam!</h1>
          <h3 class="text-center font-weight-regular px-15">The passing score for the exam was set at 85 percent, unfortunately, you did not meet this threshold.</h3>
        </div>

      </div>
      <h2 class="d-flex justify-space-between mb-3">
        Questions and answers List
        <span class="font-weight-regular text-h6">Scores {{ getScores }}/{{getNumberOfPoints}}</span>
      </h2>
      <v-card class="pa-5 rounded-0 mb-2 rounded-0 border-b px-0" flat v-for="question, n in questionnaire.questions" :key="question.id">
        <h1 class="text-subtitle-1 d-flex">
          <span>{{ n + 1}}. {{ question.text }} </span>
          <v-spacer></v-spacer>
          <span>{{ getScore(question) }} Points</span>
        </h1>
        <CurrentResponseQuestionList class="mt-2" :question="question"></CurrentResponseQuestionList>
      </v-card>
    </v-card>
    <Footer></Footer>
    <v-btn style="position: fixed;bottom: 25px;right: 45px" icon="mdi-chevron-up" size="x-large" v-if="anchorUpShow" @click="goToUp"></v-btn>
  </div>
</template>

<script setup lang="ts">
import CurrentResponseQuestionList from './components/CurrentResponseQuestionList.vue';
import Footer from './components/Footer.vue';
import { Question } from '@/store/questionnaire';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
const anchorUpShow = ref(false)
const $response = useRespondentStore()
const {response, questionnaire, answer_keys} = storeToRefs(useRespondentStore())
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

const getScores = computed(() => questionnaire.value.questions.reduce((sum, question) => sum += getScore(question),0))

const getNumberOfPoints = computed(() => answer_keys.value.reduce((sum, question) => sum += (question.answer_keys?.length || 0) * question.points,0))

const getScorePercentage = computed(() => {
  return (getScores.value / getNumberOfPoints.value * 100) || 0
})

const goToUp = () => {
  window.scrollTo(0,0)
}

const scrollShowAnchor = () => {
  if(window.scrollY > 50){
    anchorUpShow.value = true
  }else{
    anchorUpShow.value = false
  }
}

window.addEventListener('scroll', scrollShowAnchor)

onBeforeRouteLeave((to, from, next) => {
  removeEventListener('scroll', scrollShowAnchor)

  next()
})

$response.getAnwerKeys(response.value.questionnaire_id);

const download = () => {
  const link = document.getElementById("download")

  if(link){
    const file = new Blob(response.value.question_responses, {type: 'application/xls'})
    //@ts-ignore
    link.href = URL.createObjectURL(file)
    //@ts-ignore
    link.download = "sample.xls"
    link.click()
    //@ts-ignore
    URL.revokeObjectURL(link.href)
  }

}
</script>

<style scoped>
</style>
