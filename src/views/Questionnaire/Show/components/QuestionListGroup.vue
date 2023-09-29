<template>
  <!-- <v-list-group
    mandatory
    no-action
    :key="question.group_name"
    style="user-select: none;transition: .15s linear;" :class="isDragover ? 'bg-grey-lighten-1' : ''" @drop="$event => drop($event, question.group_name)" @dragover="dragOver" @dragleave="isDragover = false">
    <template #activator="{props, isOpen}">
      <v-list-item :class="isOpen ? 'bg-grey-lighten-4' : ''" v-bind="props" :title="question.group_name" @contextmenu.prevent="($event: any) => emits('right-click', $event, question)">
        <template #prepend>
          <span class="mr-4 font-weight-medium">{{ index + 1}}. </span>
        </template>
      </v-list-item>
    </template>

  </v-list-group> -->
  <v-card class="pa-0" style="user-select: none;transition: .15s linear;" :class="isDragover ? 'bg-grey-lighten-1' : ''" @drop="$event => drop($event, question.group_name)" @dragover="dragOver" @dragleave="isDragover = false" flat :key="question.group_name">
    <v-list-item @click="showLists = !showLists" :title="question.group_name" @contextmenu.prevent="($event: any) => emits('right-click', $event, question)">
      <template #prepend>
        <span class="mr-4 font-weight-medium">{{ index + 1}}. </span>
      </template>
      <template #append>
        <v-icon v-if="showLists">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon>
      </template>
    </v-list-item>
    <Transition name="slide-down" >
      <v-list class="pa-0" v-if="showLists">
        <v-list-item class="pl-15 pa-0" v-for="child, n in question.questions" :key="child.index" style="user-select: none;" :color="
        //@ts-ignore
        isChildSelected(child) && !child.is_group ? 'blue' : '#FF9B82'"
        :active="selectedQuestion.index == child.index || isChildSelected(child) && !child.is_group "
        @contextmenu.prevent="($event: any) => emits('right-click', $event, child)"
        @click="$event => click($event, child)"
        >
          <template #prepend>
            <span class="text-subtitle-2">{{ n + 1}}.</span>
          </template>
          <v-card-title  draggable="true" @dragstart="$event =>
            //@ts-ignore
            drag($event, question.index)" class="text-subtitle-2 font-weight-regular">
            {{ child.text }}
          </v-card-title>
        </v-list-item>
      </v-list>
    </Transition>
  </v-card>
</template>

<script setup lang="ts">
import useQuestionnaire from '@/composables/useQuestionnaire';
import { Question, useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
import {ref, computed, watch} from 'vue'
const showLists = ref(true)
const {update_question, group_questions} = useQuestionnaire()
const emits = defineEmits(['right-click', 'update:showMenuDialog', 'update:selectedMenuDialog'])
const props = defineProps<{selectedMenuDialog: Question[], question: {group_name: string, questions: Question[],},  index: number}>()
const {selectedQuestion, questionnaire} = storeToRefs(useQuestionnaireStore())
const isDragover = ref(false)
const someIsSelected = computed(() => props.question.questions.some(item => props.selectedMenuDialog.some(innerItem => innerItem.index == item.index)))
const isChildSelected = computed(() => (child: Question) => props.selectedMenuDialog.some(selected => selected.index == child.index))
const drop = (e: Event, group_name: string) => {
  e.preventDefault()
  e.stopPropagation()

  //@ts-ignore
  let index = e.dataTransfer.getData("question_index")
  let question = questionnaire.value.questions.find(item => item.index == index)

  if(question){
    if(props.selectedMenuDialog.length > 0){
      group_questions(props.selectedMenuDialog, props.question.group_name)
    }else{
      update_question(index, {...question, group: group_name})
    }
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

const click = (e: Event, question: Question) => {
  e.preventDefault()
  e.stopPropagation()

  emits('update:showMenuDialog', false)

  //@ts-ignore
  if(e.ctrlKey){
    const isSelected = props.selectedMenuDialog.some(item => item.index == question.index)
    console.log(isSelected);

    if(isSelected){

      const selected = props.selectedMenuDialog.slice().filter(item => item.index != question.index)
      emits('update:selectedMenuDialog', selected)
      return
    }
    const selected = props.selectedMenuDialog.slice()
    selected.push(question)
    emits('update:selectedMenuDialog', [...new Set(selected)])
    selectedQuestion.value = {} as Question
  }else{
    selectedQuestion.value = question
    emits('update:selectedMenuDialog', [])
  }
}


watch(() => props.selectedMenuDialog, () => {
  if(someIsSelected.value){
    showLists.value = true;
  }
})

</script>

<style scoped>

</style>
