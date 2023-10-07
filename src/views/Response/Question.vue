<template>
  <v-container style="user-select: none">
    <div
      class="mt-9 text-white"
      v-if="
        //@ts-ignore
        question.group_name
      "
    >
      <GroupContainer :group="question"></GroupContainer>
    </div>
    <div v-else class="text-white">
      <Container></Container>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import GroupContainer from "./components/GroupContainer.vue";
import Container from "./components/Container.vue";
import { useRespondentStore } from "@/store/respondent";
import { storeToRefs } from "pinia";
import { onBeforeRouteUpdate } from "vue-router";
const { question, questionnaire } = storeToRefs(useRespondentStore());
onBeforeRouteUpdate((to, from, next) => {
  //@ts-ignore
  const exists = questionnaire.value.questions[to.params.question_id - 1];
  if (exists) {
    question.value = exists;
  }

  return next();
});
</script>

<style scoped></style>
