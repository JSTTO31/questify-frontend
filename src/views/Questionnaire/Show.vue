<template>
  <div class="bg-grey-lighten-4 h-100 w-100 "  fluid>
    <v-app-bar flat height="100" class="pr-5" color="#57375D">
      <v-app-bar-nav-icon icon="mdi-arrow-left" @click="$router.push('/')"></v-app-bar-nav-icon>
      <h1 class="font-weight-regular ml-5">{{ questionnaire.title }}</h1>
      <v-spacer></v-spacer>
      <v-btn class="mx-1" icon="mdi-eye-outline" variant="text"></v-btn>
      <v-btn class="mx-1" icon="mdi-undo" variant="text"></v-btn>
      <v-btn class="mx-1" icon="mdi-redo" variant="text"></v-btn>
      <v-btn class="mx-1" icon="mdi-reload" variant="text" @click="reload"></v-btn>
      <!-- <span class="mx-2">
        <v-switch v-model="questionnaire.accept_responses" @change="$questionnaire.update(questionnaire)" density="compact" label="Accept Reponses" color="primary" hide-details></v-switch>
      </span> -->
      <v-btn width="150" flat prepend-icon="mdi-link" variant="elevated" :disabled="copied" color="primary" class="text-capitalize mx-1" @click="copy">
        {{copied ? 'Copied Link' : 'Copy Link'}}
      </v-btn>
      <v-btn class="mx-1" icon="mdi-dots-vertical"></v-btn>
    </v-app-bar>
    <v-app-bar flat density="compact" class="border-b d-flex" color="grey-lighten-2">
      <v-tabs class="w-100 pr-15" density="compact"  :model-value="$route.name">
        <v-spacer></v-spacer>
        <v-tab class="text-capitalize rounded-0" :to="{name: 'questionnaire.show.summary', params: {questionnaire_id: questionnaire.id}}" value="summary" prepend-icon="mdi-chart-arc">Summary</v-tab>
        <v-tab prepend-icon="mdi-account-outline" class="text-capitalize rounded-0">Analayze Individual</v-tab>
        <v-tab prepend-icon="mdi-pencil-box-multiple-outline" class="text-capitalize rounded-0" :to="{name: 'questionnaire.show.design', params: {questionnaire_id: questionnaire.id}}" value="design">Build Questions</v-tab>
        <v-tab class="text-capitalize rounded-0" prepend-icon="mdi-cog-outline" :to="{name: 'questionnaire.show.configure', params: {questionnaire_id: questionnaire.id}}">Configure</v-tab>
        <v-spacer></v-spacer>
      </v-tabs>
    </v-app-bar>
    <v-container>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import {useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const {questionnaire} = storeToRefs(useQuestionnaireStore())
const $questionnaire = useQuestionnaireStore()
const copied = ref(false)
const router = useRouter()
const copy = async () => {
  copied.value = true
  const routeData = router.resolve({name: 'response.index', params: {questionnaire_id: questionnaire.value.id}});
  const link = process.env.local_url + '' + routeData.href
  const clipboard = await navigator.clipboard
  clipboard.writeText(link)
}
const reload = () => {
  localStorage.removeItem('questionnaire');
  location.reload()
}
onMounted(() => {
  const local_questionnaire = JSON.parse(localStorage.getItem('questionnaire') || '{}')

  if(Object.keys(local_questionnaire).length > 0){
    if(questionnaire.value.id == local_questionnaire.id){
      questionnaire.value = local_questionnaire
    }
  }
})
$questionnaire.$subscribe((mutation, state) => {
  //@ts-ignore
  if(mutation.payload){
    //@ts-ignore
    if(mutation.payload.trigger == 'add question'){
    //@ts-ignore
      const question = mutation.payload.data.question;
      $questionnaire.add_question({...question, answer_keys: question.answer_keys.join(',')})
    }

    //@ts-ignore
    if(mutation.payload.trigger == 'remove question'){
      //@ts-ignore
      const question = mutation.payload.data.question;
      $questionnaire.remove_question(question.index)
    }

    //@ts-ignore
    if(mutation.payload.trigger == 'update question'){
      //@ts-ignore
      const question = mutation.payload.data.question;
      $questionnaire.update_question(question)
    }

    //@ts-ignore
    if(mutation.payload.trigger == 'add answer'){
      //@ts-ignore
      const question = mutation.payload.data.question;
      //@ts-ignore
      const answer = mutation.payload.data.answer;
      $questionnaire.add_answer(question.index, answer)
    }

     //@ts-ignore
     if(mutation.payload.trigger == 'remove answer'){
      //@ts-ignore
      const question = mutation.payload.data.question;
      //@ts-ignore
      const answer = mutation.payload.data.answer;
      $questionnaire.remove_answer(question.index, answer.index)
    }

     //@ts-ignore
     if(mutation.payload.trigger == 'update answer'){
      //@ts-ignore
      const question = mutation.payload.data.question;
      //@ts-ignore
      const answer = mutation.payload.data.answer;
      $questionnaire.update_answer(question.index, answer)
    }

    localStorage.setItem('questionnaire', JSON.stringify(questionnaire.value))
  }
})

</script>

<style scoped>

</style>
