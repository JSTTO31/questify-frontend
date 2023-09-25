<template>
  <v-menu :model-value="show && Object.keys(selectedQuestion).length > 0" :key="selectedQuestion" @update:model-value="update_model" transition="slide-y-transition">
    <v-card class="rounded-lg pb-5" elevation="5" id="card" width="200"  height="auto" v-if="!selectedQuestion.is_group">
      <v-list class="pa-0">
        <v-list-item append-icon="mdi-select" @click.prevent="selectedQuestionStore = selectedQuestion" class="font-weight-regular">Select</v-list-item>
        <v-list-item append-icon="mdi-group" class="font-weight-regular" @click="update_question(
          //@ts-ignore
          selectedQuestion.index, {...selectedQuestion, group: group_name})" :disabled="selectedQuestion && !!selectedQuestion.group ">Group</v-list-item>
        <v-list-item append-icon="mdi-ungroup" class="font-weight-regular" @click="update_question(
          //@ts-ignore
        selectedQuestion.index, {...selectedQuestion, group: group_name})" v-if="selectedQuestion && selectedQuestion.group ">Ungroup</v-list-item>
        <v-list-item append-icon="mdi-trash-can-outline" @click.prevent="remove_question(selectedQuestion)" class="font-weight-regular">Remove</v-list-item>
      </v-list>
    </v-card>
    <v-card class="rounded-lg pb-5" elevation="5" id="card" width="200"  height="auto" v-else>
      <v-list class="pa-0">
        <v-list-item append-icon="mdi-ungroup" @click.prevent="remove_group(selectedQuestion.group_name)" class="font-weight-regular">Ungroup</v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import {computed} from 'vue'
import useQuestionnaire from '@/composables/useQuestionnaire';
import { Question, useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
defineProps<{selectedQuestion: Question, show: boolean}>()
const emits = defineEmits(['update:show', 'update:selected-question'])
const {selectedQuestion: selectedQuestionStore, questionnaire} = storeToRefs(useQuestionnaireStore())
const {remove_question, update_question, remove_group} = useQuestionnaire()
const update_model = (value: any) => {
  emits('update:show', value)
  emits('update:selected-question', {} as Question)
}
const group_name = computed(() => {
  console.log(questionnaire.value.questions.filter(item => item.group));

  //@ts-ignore
  const hasUntitled = questionnaire.value.questions.filter(item => item.group).sort((a,b) => b.group?.localeCompare(a.group))[0]
  console.log(hasUntitled);

  if(hasUntitled){
    //@ts-ignore
    const number = hasUntitled.group?.match(/[0-9]/ig)

    console.log(number, hasUntitled.group);

    //@ts-ignore
    return 'Untitled group ' + (number == undefined  ? 1 : parseInt(number[0]) + 1)
  }else{
    return 'Untitled group'
  }
})

</script>

<style scoped>
#card{
  position: fixed;
  z-index: 50000;

}
</style>
