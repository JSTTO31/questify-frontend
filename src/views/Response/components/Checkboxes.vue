<template>
  <div>
    <v-card @click="selectAnswer(
        //@ts-ignore
        question.id, answer.index)"
        class="d-flex align-center  my-5 pa-0 font-weight-medium"
        v-for="answer in question.answers"
        :key="answer.id"
        :variant="currentAnswer.length < 1 ? 'elevated' : isSelected(answer) ? 'elevated' : 'tonal'"
        style="user-select: none;"
        >
        <v-col cols="1">
          <v-checkbox color="primary"  :model-value="isSelected(answer)" hide-details></v-checkbox>
        </v-col>
        <v-col cols="11">
          {{ answer.text }}
        </v-col>
      </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRespondentStore } from '@/store/respondent';
import useRespondent from '../../../composables/useRespondent'
import { storeToRefs } from 'pinia';
const {question} = storeToRefs(useRespondentStore())
const {selectAnswer, currentAnswer, isSelected} = useRespondent()
</script>

<style scoped>

</style>
