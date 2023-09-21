<template>
  <v-navigation-drawer width="300">
    <v-layout class="w-100 h-100" >
      <v-app-bar flat class="border-b" color="grey-lighten-5" density="compact">
        <v-app-bar-title class="text-subtitle-1">Question List</v-app-bar-title>
      </v-app-bar>
      <v-main class="h-100" >
        <v-list class="pa-0 h-100" style="overflow-y: auto;">
          <v-hover v-slot="{isHovering, props}" v-for="(question, n) in questionnaire.questions" :key="question.random_id">
            <v-list-item v-bind="props" color="#FF9B82"  :title="question.text" class="text-center" @click="selectedQuestion = question"  :active="selectedQuestion.index == question.index">
            <template #prepend>{{ n + 1}}.</template>
            <template #append>
              <v-btn style="position: absolute;right: -17%;" class="mr-15" size="small" variant="text" color="error" v-if="isHovering" icon="mdi-trash-can-outline" @click="remove_question(question)"></v-btn>
            </template>
          </v-list-item>
          </v-hover>
        </v-list>
      </v-main>
      <v-footer app class="pa-0" color="transparent">
        <v-btn @click="add_question('multiple')" class="rounded-0" color="primary" prepend-icon="mdi-plus" block>Add Question</v-btn>
      </v-footer>
    </v-layout>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import useQuestionnaire from '@/composables/useQuestionnaire';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
const {add_question, remove_question} = useQuestionnaire()
const {questionnaire, selectedQuestion} = storeToRefs(useQuestionnaireStore())
</script>

<style scoped>

</style>
