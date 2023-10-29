<template>
  <v-menu
    :model-value="show && Object.keys(selectedQuestions).length > 0"
    style="user-select: none"
    :key="key"
    @update:model-value="update_model"
    transition="slide-y-transition"
  >
    <v-card
      class="rounded-lg pb-5"
      elevation="5"
      id="card"
      width="200"
      height="auto"
      v-if="
        firstSelected &&
        selectedQuestions.length < 2 &&
        //@ts-ignore
        !firstSelected.is_group
      "
    >
      <v-list class="pa-0">
        <v-list-item
          append-icon="mdi-select"
          @click.prevent="selectedQuestionStore = firstSelected"
          class="font-weight-regular"
          >Select</v-list-item
        >
        <v-list-item
          append-icon="mdi-group"
          class="font-weight-regular"
          @click="update_question({ ...firstSelected, group: group_name })"
          :disabled="firstSelected && !!firstSelected.group"
          >Group</v-list-item
        >
        <v-list-item
          append-icon="mdi-ungroup"
          class="font-weight-regular"
          @click="update_question({ ...firstSelected, group: '' })"
          :disabled="firstSelected && !firstSelected.group"
          >Ungroup</v-list-item
        >
        <v-list-item
          append-icon="mdi-trash-can-outline"
          @click.prevent="remove_question(firstSelected)"
          class="font-weight-regular"
          >Remove</v-list-item
        >
      </v-list>
    </v-card>
    <v-card
      class="rounded-lg pb-5"
      elevation="5"
      id="card"
      width="200"
      height="auto"
      v-else-if="
        //@ts-ignore
        firstSelected.is_group
      "
    >
      <v-list class="pa-0">
        <v-list-item
          append-icon="mdi-text"
          class="font-weight-regular"
          @click="
            //@ts-ignore
            selected_group_name = selectedQuestions[0].group_name
          "
          >Rename</v-list-item
        >
        <v-list-item
          append-icon="mdi-ungroup"
          @click.prevent="
            //@ts-ignore
            remove_group(firstSelected.group_name)
          "
          class="font-weight-regular"
          >Ungroup</v-list-item
        >
      </v-list>
    </v-card>
    <v-card
      class="rounded-lg pb-5"
      elevation="5"
      id="card"
      width="200"
      height="auto"
      v-else
    >
      <v-list class="pa-0">
        <v-list-item
          append-icon="mdi-group"
          class="font-weight-regular"
          @click="group"
          :disabled="firstSelected && !!firstSelected.group"
          >Group</v-list-item
        >
        <v-list-item
          append-icon="mdi-ungroup"
          class="font-weight-regular"
          @click="Ungroup"
          v-if="hasGroup"
          >Ungroup</v-list-item
        >
        <v-list-item
          append-icon="mdi-trash-can-outline"
          @click.prevent="remove_questions(selectedQuestions)"
          class="font-weight-regular"
          >Remove</v-list-item
        >
      </v-list>
    </v-card>
  </v-menu>
  <v-dialog
    :model-value="!!selected_group_name"
    @click:outside="selected_group_name = ''"
    width="459"
    scrim="transparent"
  >
    <v-card class="rounded-lg pa-5">
      <h3 class="font-weight-regular mb-2">Rename</h3>
      <v-text-field
        prepend-inner-icon="mdi-text"
        :model-value="selected_group_name"
        label="Group name"
        :error-messages="selected_group_name_error"
        @keyup.enter="($event: any) => rename($event.target.value)"
        single-line
        variant="outlined"
      ></v-text-field>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed } from "vue";
import useQuestionnaire from "@/composables/useQuestionnaire";
import { Question, useQuestionnaireStore } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const selected_group_name = ref("");
const selected_group_name_error = ref("");
const props = defineProps<{ selectedQuestions: Question[]; show: boolean }>();
const emits = defineEmits(["update:show", "update:selected-questions"]);
const { selectedQuestion: selectedQuestionStore, questionnaire } = storeToRefs(
  useQuestionnaireStore()
);
const {
  remove_questions,
  remove_question,
  update_question,
  update_questions,
  remove_group,
  group_questions,
} = useQuestionnaire();
const update_model = (value: any) => {
  emits("update:show", value);
  emits("update:selected-questions", []);
};
const firstSelected = computed(() => props.selectedQuestions[0]);
const key = computed(() =>
  props.selectedQuestions.reduce((string, item) => (string += item.index), "")
);
const group_name = computed(() => {
  //@ts-ignore
  const hasUntitled = questionnaire.value.questions
    .filter((item) => item.group)
    //@ts-ignore
    .sort((a, b) => b.group?.localeCompare(a.group))[0];

  if (hasUntitled) {
    //@ts-ignore
    const number = hasUntitled.group?.match(/[0-9]/gi);

    //@ts-ignore
    return "Untitled group " + (number == undefined ? 1 : parseInt(number[0]) + 1);
  } else {
    return "Untitled group";
  }
});
const hasGroup = computed(() => props.selectedQuestions.some((item) => !!item.group));
const group = () => {
  group_questions(props.selectedQuestions, group_name.value);
  emits("update:selected-questions", []);
};
const Ungroup = () => {
  const questions = props.selectedQuestions
    .slice()
    .map((item) => ({ ...item, group: "" }));
  update_questions(questions);
};
const rename = (text: string) => {
  const questions = questionnaire.value.questions.filter(
    //@ts-ignore
    (item) => item.group == selected_group_name.value
  );

  if (!text.length) {
    selected_group_name_error.value = "The group name is required!";
    return;
  }

  group_questions(questions, text);
  selected_group_name.value = "";
  selected_group_name_error.value = "";
};
</script>

<style scoped>
#card {
  position: fixed;
  z-index: 50000;
}
</style>
