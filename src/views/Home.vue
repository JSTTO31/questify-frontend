<template>
  <v-container class="bg-grey-lighten-5 h-100" style="padding-inline: 150px;padding-block: 50px;" fluid>
    <div class="d-flex align-center">
      <h3>Questionnaires</h3>
      <v-spacer></v-spacer>
      <v-btn flat size="small" @click="showAddQuestionnaireDialog = true" prepend-icon="mdi-plus" color="primary" class="text-capitalize">Add Questionnaire</v-btn>
      <AddQuestionnaireDialog v-model:show-dialog="showAddQuestionnaireDialog"></AddQuestionnaireDialog>
    </div>
    <div class="mt-5">
      <v-card class="pa-5 border rounded-lg d-flex mb-3" @click="$router.push({name: 'questionnaire.show', params: {questionnaire_id: questionnaire.id}})" flat v-for="questionnaire in questionnaires" :key="questionnaire.id">
        <div class="w-75">
          <v-card-title>{{ questionnaire.title }}</v-card-title>
          <v-card-subtitle>{{ questionnaire.subtitle }}</v-card-subtitle>
        </div>
        <v-card-text class="w-25 d-flex align-center">
          <div class="h-100 w-100 d-flex align-center justify-center flex-column">
            <h1 class="text-center mb-2">250 </h1>
            <h3>
              <v-icon>mdi-account</v-icon>
              Responses</h3>

          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import AddQuestionnaireDialog from '@/components/AddQuestionnaireDialog.vue';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const $questionnaire = useQuestionnaireStore()
const {questionnaires} = storeToRefs($questionnaire);
const showAddQuestionnaireDialog = ref(false)

$questionnaire.getAll();
</script>
