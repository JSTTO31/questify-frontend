<template>
  <div class="h-100">
      <div class="text-center text-white py-15">
        <h1 class="text-center">Your Questions and Answers</h1>
      </div>
      <div class="d-flex flex-wrap">
        <v-col cols="6" v-for="(question, n) in questionnaire.questions" :key="question.id">
          <ReviewQuestionListItem :question="question" :index="n"></ReviewQuestionListItem>
        </v-col>
      </div>
      <div class="d-flex mt-10 mr-3">
        <v-spacer></v-spacer>
        <v-btn size="large" color="primary" @click="showSubmit = true">Submit</v-btn>
      </div>
      <v-dialog v-model="showSubmit" width="700" style="z-index: 500000">
        <v-card class="d-flex flex-column justify-center align-center pa-15 rounded-xl" >
          <v-avatar class="rounded-0" size="180">
            <v-img src="/src/assets/request.png"></v-img>
          </v-avatar>
          <h1 class="text-center mt-2 text-grey-darken-3">Are you sure you want to submit the questionnaire?</h1>
          <v-alert type="info" variant="tonal" color="info" class="mt-5 mb-2">
            Before you submit your questionnaire, please take a moment to review your responses. Once submitted, you will not be able to make any changes or corrections
          </v-alert>
          <div class="d-flex w-100 mt-5">
            <v-btn class="mr-5 rounded-lg" size="x-large"  color="primary" @click="submit">Submit</v-btn>
            <v-btn class="mr-5 rounded-lg" flat size="x-large" @click="showSubmit = false">Cancel</v-btn>
          </div>
        </v-card>
      </v-dialog>
  </div>
</template>

<script setup lang="ts">
import ReviewQuestionListItem from '@/components/ReviewQuestionListItem.vue';
import useRespondent from '@/composables/useRespondent';
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const showSubmit = ref(false)
const {questionnaire} = storeToRefs(useRespondentStore())
const {submit} = useRespondent()
</script>

<style scoped>

</style>
