<template>
  <component :is="component" :question="question" class="border-b rounded-0"></component>
</template>

<script setup lang="ts">
import GroupCheckboxes from "./GroupCheckboxes.vue";
import { Question } from "@/store/questionnaire";
import GroupMultipleChoicesVue from "./GroupMultipleChoices.vue";
import { shallowRef } from "vue";
import GroupDragAndDrop from "./GroupDragAndDrop.vue";
import GroupSelect from "./GroupSelect.vue";
import GroupText from "./GroupText.vue";
import GroupParagraph from "./GroupParagraph.vue";
const props = defineProps<{ question: Question }>();
const component = shallowRef(GroupMultipleChoicesVue);

if (props.question.type == "check") {
  component.value = GroupCheckboxes;
}

if (props.question.type == "drag") {
  component.value = GroupDragAndDrop;
}

if (props.question.type == "select") {
  component.value = GroupSelect;
}

if (props.question.type == "text") {
  component.value = GroupText;
}

if (props.question.type == "paragraph") {
  component.value = GroupParagraph;
}
</script>

<style scoped></style>
