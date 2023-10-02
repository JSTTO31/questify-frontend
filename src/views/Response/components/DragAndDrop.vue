<template>
  <div>
    <h1 class="mb-10 text-center">
      {{ question.text }}
      <span @drop="drop" @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false" :class="isDragOver ? 'bg-primary' : ''" v-if="currentAnswer.length < 1" style="color: transparent;" class="bg-white rounded-lg px-2">__________________</span>
      <span @drop="drop" @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false" :class="isDragOver ? 'bg-primary' : ''" v-else class="bg-white rounded-lg px-2" >{{ currentAnswer[0] }}</span>
    </h1>
    <v-card flat class="bg-transparent mt-15" style="border-color: white !important;">
      <v-row>
        <v-col cols="6" v-for="answer in question.answers" :key="answer.id">
          <DragAndDropItem :answer="answer"></DragAndDropItem>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import DragAndDropItem from './DragAndDropItem.vue';
import { useRespondentStore } from '@/store/respondent';
import useRespondent from '../../../composables/useRespondent'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const isDragOver = ref(false)
const {question } = storeToRefs(useRespondentStore())
const {selectAnswer, currentAnswer, clearAnswer} = useRespondent()
const select = (question_id: number, answer: string) => {
  clearAnswer(question_id)
  selectAnswer(question_id, answer)
}
const drop = (e: any) => {
  const answer_index = e.dataTransfer.getData('answer_index');
  const answer = question.value.answers.find(item => item.index == answer_index)
  //@ts-ignore
  select(question.value.id, answer.text)
  isDragOver.value = false
}
</script>

<style scoped>

</style>
