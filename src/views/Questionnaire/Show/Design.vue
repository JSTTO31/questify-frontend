<template>
  <QuestionListNav></QuestionListNav>
  <DesignSettingNav></DesignSettingNav>
  <QuestionContainer :key="selectedQuestion.index" v-if="Object.keys(selectedQuestion).length > 0"></QuestionContainer>
  <div v-else>
    No selected question
  </div>
</template>

<script setup lang="ts">
import QuestionContainer from './components/QuestionContainer.vue';
import QuestionListNav from './components/QuestionListNav.vue';
import DesignSettingNav from './components/DesignSettingNav.vue'
import { storeToRefs } from 'pinia';
import { useQuestionnaireStore } from '@/store/questionnaire';
const {selectedQuestion} = storeToRefs(useQuestionnaireStore())
</script>

<style scoped>

</style>
