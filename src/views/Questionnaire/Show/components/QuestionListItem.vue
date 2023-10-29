<template>
  <v-list-item
    style="user-select: none"
    :color="isSelected ? 'blue' : '#FF9B82'"
    @click="click"
    :active="selectedQuestion.index == question.index || isSelected"
  >
    <template #prepend>
      <span class="font-weight-medium">{{ index + 1 }}.</span>
    </template>
    <v-card-title
      draggable="true"
      @dragstart="
        ($event) =>
          //@ts-ignore
          drag($event, question.index)
      "
      class="text-subtitle-1 font-weight-regular"
    >
      {{ question.text }}
    </v-card-title>
  </v-list-item>
</template>

<script setup lang="ts">
import router from "@/router";
import { Question, useQuestionnaireStore } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { computed } from "vue";
const { selectedQuestion } = storeToRefs(useQuestionnaireStore());
const props = defineProps<{
  question: Question;
  selectedMenuDialog: Question[];
  index: number;
}>();
const emits = defineEmits(["update:selectedMenuDialog", "update:showMenuDialog"]);
const drag = (e: Event, question_index: number) => {
  //@ts-ignore
  e.dataTransfer.setData("question_index", question_index);
};
const isSelected = computed(() =>
  props.selectedMenuDialog.some((selected) => selected.index == props.question.index)
);
const click = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();

  emits("update:showMenuDialog", false);

  //@ts-ignore
  if (e.ctrlKey) {
    const isSelected = props.selectedMenuDialog.some(
      (item) => item.index == props.question.index
    );

    if (isSelected) {
      const selected = props.selectedMenuDialog
        .slice()
        .filter((item) => item.index != props.question.index);
      emits("update:selectedMenuDialog", selected);
      return;
    }

    const selected = props.selectedMenuDialog.slice();
    selected.push(props.question);
    emits("update:selectedMenuDialog", [...new Set(selected)]);
    selectedQuestion.value = {} as Question;
  } else {
    selectedQuestion.value = props.question;
    emits("update:selectedMenuDialog", []);
  }

  // router.push({ query: { questiondx: props.question.index } });
};
</script>

<style scoped></style>
