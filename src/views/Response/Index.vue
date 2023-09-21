<template>
   <v-container class="h-100 w-100 d-flex justify-center align-center">
      <v-card class="pa-15 d-flex flex-column justify-center align-center rounded-lg" width="650">
        <v-avatar size="150" class="rounded-0">
          <v-img src="/src/assets/examination.png"></v-img>
        </v-avatar>
        <h1 class="text-center">{{ questionnaire.title }}</h1>
        <p class="text-center">{{ questionnaire.subtitle }}</p>
        <div class="d-flex align-center justify-center mt-15" v-if="questionnaire.accept_responses">
          <v-btn color="secondary" :to="{name: 'response.question', params: {question_id: first_question.id}}" :disabled="!first_question" @click="getStarted" :loading="loading">Get's Started</v-btn>
        </div>
        <div v-else class="mt-15">
            <h2 class="font-weight-medium text-error">
              <v-icon>mdi-alert-circle</v-icon>
              Not Available</h2>
        </div>
      </v-card>
    </v-container>
</template>

<script setup lang="ts">
import useRespondent from '@/composables/useRespondent'
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const $respondent = useRespondentStore()
const {questionnaire} = storeToRefs(useRespondentStore())
const {first_question} = useRespondent()
const loading = ref(false)
const getStarted = () => {
  loading.value = true
  $respondent.createResponse().then(() => loading.value = false)
}
</script>

<style scoped>

</style>
