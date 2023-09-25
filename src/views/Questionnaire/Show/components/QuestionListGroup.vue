<template>
  <v-list-group style="user-select: none;transition: .15s linear;" :class="isDragover ? 'bg-grey-lighten-1' : ''" @drop="$event => drop($event, question.group_name)" @dragover="dragOver" @dragleave="isDragover = false">
    <template #activator="{props}">
      <v-list-item v-bind="props" :title="question.group_name" @contextmenu.prevent="($event: any) => emits('right-click', $event, question)">
        <template #prepend>
          <span class="mr-4 font-weight-medium">{{ index + 1}}.</span>
        </template>
      </v-list-item>
    </template>
    <v-list-item v-for="child, n in question.questions" :key="child.index" style="user-select: none;" :color="selectedMenuDialog && selectedMenuDialog.index == child.index ? 'blue' : '#FF9B82'"  @click="selectedQuestion = child"  :active="selectedQuestion.index == child.index || (selectedMenuDialog && selectedMenuDialog.index == child.index)"
    @contextmenu.prevent="($event: any) => emits('right-click', $event, child)"
    >
      <template #prepend>
        <span class="mr-4 font-weight-medium">{{ n + 1}}.</span>
      </template>
      <v-card-title  draggable="true" @dragstart="$event =>
        //@ts-ignore
        drag($event, question.index)" class="text-subtitle-1 font-weight-regular">
        {{ child.text }}
      </v-card-title>
    </v-list-item>
  </v-list-group>
</template>

<script setup lang="ts">
import useQuestionnaire from '@/composables/useQuestionnaire';
import { Question, useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
import {ref} from 'vue'
const {update_question} = useQuestionnaire()
const emits = defineEmits(['right-click'])
const props = defineProps<{selectedMenuDialog: Question, question: {group_name: string, questions: Question[],},  index: number}>()
const {selectedQuestion, questionnaire} = storeToRefs(useQuestionnaireStore())
const isDragover = ref(false)

const drop = (e: Event, group_name: string) => {
  e.preventDefault()
  e.stopPropagation()

  //@ts-ignore
  let index = e.dataTransfer.getData("question_index")
  let question = questionnaire.value.questions.find(item => item.index == index)

  if(question){
    update_question(index, {...question, group: group_name})
  }

  isDragover.value = false
}

const dragOver = (e: any) =>{
  e.preventDefault()
  e.stopPropagation()
  isDragover.value = true
}

const drag = (e: any, question_index: number) => {
  e.dataTransfer.setData("question_index", question_index)
  e.dataTransfer.setData("is_child", 'true')
  e.dataTransfer.setData("text/plain", 'some message')


}
</script>

<style scoped>

</style>
