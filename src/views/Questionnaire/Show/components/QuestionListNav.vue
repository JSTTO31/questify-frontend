<template>
  <v-navigation-drawer width="310">
    <v-layout class="w-100 h-100">
      <v-app-bar flat class="border-b" app color="grey-lighten-5" density="compact">
        <v-app-bar-title class="text-subtitle-1">Question List</v-app-bar-title>
      </v-app-bar>
      <v-main class="h-100" >
        <v-list class="pa-0 h-100" ref="parentList" id="list" style="overflow-y: auto;" @dragover.prevent="isDragover = true
"         @drop.prevent="drop" @dragleave.prevent="isDragover = false" :class="isDragover ? 'bg-grey-lighten-2' : ''"       @click="selected = []">
          <div
            v-for="(question, n) in questions" :key="question"
          >
              <QuestionListItem
                @contextmenu="($event: any) => showMenu($event, question)"
                :question="question" :index="n"
                v-model:selected-menu-dialog="selected"
                v-model:showMenuDialog="showMenuDialog"
                v-if="!question.is_group"></QuestionListItem>
              <QuestionListGroup
                :question="question"
                v-model:selected-menu-dialog="selected" :index="n"
                v-model:show-menu-dialog="showMenuDialog"
                @right-click="showMenu" v-else></QuestionListGroup>
          </div>
        </v-list>
      </v-main>
      <v-footer app class="pa-0" color="transparent">
        <v-btn @click="add_question('multiple')" class="rounded-0" color="primary" prepend-icon="mdi-plus" block>Add Question</v-btn>
      </v-footer>
      <MenuDialog
        v-model:show="showMenuDialog"
        v-model:selected-questions="selected"
        ></MenuDialog>
    </v-layout>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import QuestionListGroup from './QuestionListGroup.vue';
import QuestionListItem from './QuestionListItem.vue';
import MenuDialog from './MenuDialog.vue';
import useQuestionnaire from '@/composables/useQuestionnaire';
import { Question, useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
import {ref, computed} from 'vue'
import { onBeforeRouteLeave } from 'vue-router';
const parentList = ref(null)
const {add_question, update_question, update_questions} = useQuestionnaire()
const {questionnaire} = storeToRefs(useQuestionnaireStore())
const selected = ref([] as Question[])
const showMenuDialog = ref(false)
const outside = ref(false)
const questions = computed(() => {
  const groups : any = [];
  const noGroup : any = []
  questionnaire.value.questions.forEach((question, index) => {
    if(!question.group){
      noGroup.push(questionnaire.value.questions[index])
    }else{
      const group_name = questionnaire.value.questions[index].group
      const group = groups.find((item: any) => item.group_name == group_name)
      if(group){
        group.questions.push(questionnaire.value.questions[index])
      }else{
        groups.push({
          group_name,
          index: questionnaire.value.questions[index].index,
          questions: [questionnaire.value.questions[index]],
          is_group: true
        })
      }
    }
  })
  //@ts-ignore
  return groups.sort((a,b) => {
    return a.group_name.localeCompare(b.group_name)
  }).concat(noGroup.sort((a: any,b: any) => {
    return a.index - b.index

  }))
})

const isDragover = ref(false)

const showMenu = (e: Event, question: Question) => {
  e.preventDefault()
  showMenuDialog.value = true
  outside.value = false
  const isSelected = selected.value.some(item => item.index == question.index)
  //@ts-ignore
  if(isSelected){
    return
  }else{
    selected.value = [question]
  }
}

const drop = (e: Event) => {
  e.preventDefault()
  isDragover.value = false
  //@ts-ignore
  let index = e.dataTransfer.getData("question_index")
  //@ts-ignore
  let is_child = e.dataTransfer.getData("is_child")
  let question = questionnaire.value.questions.find(item => item.index == index)

  if(question && is_child){
    if(selected.value.length > 0){
      let questions = selected.value.map(item => ({...item, group: ''}))
      update_questions(questions)
      selected.value = []
    }else{
      update_question(index, {...question, group: ''})
    }
  }

}

const contextmenuFn = (e: any) => {
  e.preventDefault()
  if(!outside.value){
    outside.value = true
  }else{
    selected.value = []
  }

  const card = document.getElementById('card')

  if(card){
    if(screen.height <= (e.y + card.clientHeight) + 100){
      card.style.top = (e.y - card.clientHeight) + 'px';
      card.style.left = e.x + 'px';
    }else{
      card.style.top = e.y + 'px';
      card.style.left = e.x + 'px';
    }
  }
}

const selectAll = (e: Event) => {
  //@ts-ignore
  if(e.ctrlKey && e.key == 'a' && selected.value.length > 0){
    selected.value = questionnaire.value.questions
  }


}

const windowClick = (e: Event) => {
  selected.value = []
}

window.addEventListener('contextmenu', contextmenuFn)
window.addEventListener('click', windowClick)
window.addEventListener('keyup', selectAll)

onBeforeRouteLeave((to, from, next) => {
  removeEventListener('contextmenu', contextmenuFn)
  removeEventListener('click', windowClick)
  removeEventListener('keyup', selectAll)
  next()
})

</script>

<style scoped>

#list{
  transition: all .2s linear;
}

#list:hover::-webkit-scrollbar-thumb{
  background-color: rgb(165, 165, 165);

}


#list::-webkit-scrollbar{
  width: 7px;
}

#list::-webkit-scrollbar-thumb{
  background-color: #ffffff;
  border-radius: 50px;
}
</style>
