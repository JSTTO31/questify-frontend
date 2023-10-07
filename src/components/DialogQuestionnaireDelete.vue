<template>
  <v-dialog
    width="550"
    :model-value="showDialog"
    @click:outside="emits('update:showDialog', false)"
  >
    <v-card class="pa-10 rounded-lg">
      <v-icon size="150" color="error" class="mx-auto">mdi-alert-circle-outline</v-icon>
      <h3 class="mt-5 text-center font-weight-regular">
        Are you sure you want to delete this questionnaire
        <strong>{{ questionnaire.title }}</strong
        >?
      </h3>
      <v-card-actions class="d-flex justify-center mt-3">
        <v-btn
          variant="outlined"
          flat
          rounded
          class="text-capitalize px-5"
          color="error"
          @click="destroy"
          :loading="isLoading"
          :disabled="isLoading"
          >Yes, delete it</v-btn
        >
        <v-btn
          variant="outlined"
          flat
          rounded
          class="text-capitalize px-5"
          color="blue-darken-1"
          @click="emits('update:showDialog', false)"
          >No, i dont want</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "@/store/questionnaire";
import { ref } from "vue";
const $questionnaire = useQuestionnaireStore();
const props = defineProps(["showDialog", "questionnaire"]);
const emits = defineEmits(["update:showDialog"]);
const isLoading = ref(false);
const destroy = () => {
  isLoading.value = true;

  $questionnaire.delete(props.questionnaire.id).then(() => {
    isLoading.value = false;
    emits("update:showDialog", false);
  });
};
</script>

<style scoped></style>
