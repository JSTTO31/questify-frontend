<template>
  <div class="h-100 w-100 py-10 d-flex flex-column">
    <v-card class="pa-10 rounded-lg">
      <div class="d-flex" v-if="response.submitted_at && timer">
        <div >
          <h1>Congratulations! <v-icon color="success">mdi-check-circle</v-icon></h1>
          <p>You've just completed the <strong>{{ questionnaire.title }}</strong></p>
          <p>Well done on your dedication to preparing for your upcoming exam!</p>
          <p>Your commitment to practice is a big step towards success, and we're here to support you every step of the way.</p>
          <p>Keep up the great work, and best of luck with your studies!</p>
          <v-alert type="info"  variant="tonal" class="my-5">
            Please note that you'll need to wait for other participants to complete the questionnaire before we can provide you with the results.
          </v-alert>
          <v-btn disabled class="font-weight-bold px-5" prepend-icon="mdi-clock" width="150" v-if="timer != -1">Result {{ timer }}</v-btn>
          <v-btn color="primary" class="font-weight-bold" width="150" v-else @click="$router.push({name: 'response.result'})">See Result</v-btn>
        </div>
      </div>
    </v-card>
    <v-spacer></v-spacer>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import Footer from './components/Footer.vue'
import { useRespondentStore } from '@/store/respondent';
import { storeToRefs } from 'pinia';
import { inject } from 'vue';
const timer = inject('timer')
const {questionnaire, response, times_up} = storeToRefs(useRespondentStore())


</script>

<style scoped>

</style>
