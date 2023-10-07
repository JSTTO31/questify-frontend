<template>
  <v-dialog
    width="550"
    :model-value="showDialog"
    @click:outside="emits('update:showDialog', false)"
  >
    <v-card class="pa-5 rounded-lg" :disabled="isLoading">
      <h2 class="mb-5">Update Questionnaire</h2>
      <v-text-field
        class="mb-2"
        v-model="$v.title.$model"
        :error-messages="showError($v.title)"
        variant="outlined"
        label="Questionnaire title"
        single-line
        @keyup.enter="submit"
      ></v-text-field>
      <v-textarea
        v-model="create.subtitle"
        variant="outlined"
        label="Questionnaire subtitle"
        single-line
      ></v-textarea>
      <v-card-actions class="px-0">
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-4"
          variant="elevated"
          @click="submit"
          :loading="isLoading"
          >Update</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
//@ts-ignore
import { showError } from "@/composables/useUtilities";
//@ts-ignore
import useQuestionnaireEditForm from "../composables/useQuestionnaireEditForm";
import { useQuestionnaireStore } from "@/store/questionnaire";
const props = defineProps(["showDialog", "questionnaire"]);
const emits = defineEmits(["update:showDialog"]);
const { create, $v, isLoading } = useQuestionnaireEditForm(props.questionnaire);
const $questionnaire = useQuestionnaireStore();
const submit = () => {
  if ($v.value.$invalid) {
    $v.value.$touch();
    return;
  }

  isLoading.value = true;

  $questionnaire.update({ ...props.questionnaire, ...create }).then((response) => {
    isLoading.value = false;
    emits("update:showDialog", false);
    $v.value.$reset();
  });
};
</script>

<style scoped></style>
