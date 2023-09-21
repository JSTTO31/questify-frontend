<template>
  <v-container>
    <h1 class="text-center font-weight-medium text-white">{{ question.text }}</h1>
    <div class="mt-9" style="padding-inline: 120px;" >
      <Container></Container>
    </div>
    Example
  </v-container>
</template>

<script setup lang="ts">
import Container from './components/Container.vue'
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { onBeforeRouteUpdate } from 'vue-router';
const {question,questionnaire} = storeToRefs(useRespondentStore())
onBeforeRouteUpdate((to, from, next) => {
  //@ts-ignore
  const exists = questionnaire.value.questions.find(item => item.id == to.params.question_id)
  if(exists){
    question.value = exists
  }

  return next()
})

</script>

<style scoped>

</style>
