<template>
  <v-card class="pa-5">
    <h3>{{ question.text }}</h3>
    <VRadioGroup class="pa-0 mt-5" v-model="selected" @update:model-value="select">
      <v-radio color="primary" class="px-0" :label="answer.text" :value="answer.text" v-for="answer in question.answers" :key="answer.id"></v-radio>
    </VRadioGroup>
  </v-card>
</template>

<script setup lang="ts">
import { Question } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
import { useRespondentStore } from '@/store/respondent';
import { ref } from 'vue';
import useRespondent from '@/composables/useRespondent';
import { computed } from 'vue';
const props = defineProps<{question: Question}>()
const {response} = storeToRefs(useRespondentStore())
const {selectAnswer, clearAnswer} = useRespondent()
const currentAnswer = computed(() => response.value.question_responses.find(item => item.question_id == props.question.id))
const selected = ref(currentAnswer.value?.answer_keys[0] || '')
const select = () => {
  //@ts-ignore
  clearAnswer(props.question.id)
  //@ts-ignore
  selectAnswer(props.question.id, selected.value)
}
</script>

<style scoped>

</style>
