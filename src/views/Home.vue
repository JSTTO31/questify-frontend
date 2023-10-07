<template>
  <v-container
    class="bg-grey-lighten-5 h-100"
    style="padding-inline: 150px; padding-block: 50px"
    fluid
  >
    <div class="d-flex align-center">
      <h3>Questionnaires</h3>
      <v-spacer></v-spacer>
      <v-btn
        flat
        size="small"
        @click="showAddQuestionnaireDialog = true"
        prepend-icon="mdi-plus"
        color="primary"
        class="text-capitalize"
        >Add Questionnaire</v-btn
      >
      <AddQuestionnaireDialog
        v-model:show-dialog="showAddQuestionnaireDialog"
      ></AddQuestionnaireDialog>
    </div>
    <div class="mt-5">
      <QuestionnaireCardItem
        v-for="questionnaire in questionnaires"
        :questionnaire="questionnaire"
        :key="questionnaire.id"
      ></QuestionnaireCardItem>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import QuestionnaireCardItem from "@/components/QuestionnaireCardItem.vue";
import AddQuestionnaireDialog from "@/components/AddQuestionnaireDialog.vue";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const $questionnaire = useQuestionnaireStore();
const { questionnaires } = storeToRefs($questionnaire);
const showAddQuestionnaireDialog = ref(false);

$questionnaire.getAll();
</script>
