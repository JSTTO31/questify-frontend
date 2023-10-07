<template>
  <div style="padding-inline: 150px">
    <v-card class="rounded-lg">
      <v-row>
        <v-col class="pa-15 d-flex align-center">
          <div>
            <h3>Total of responses</h3>
            <h1>{{ questionnaire.responses_count }}</h1>
          </div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col class="pa-15">
          <h3>Survey Status</h3>
          <h1 class="text-success" v-if="questionnaire.accept_responses">Open</h1>
          <h1 class="text-error" v-else>Closed</h1>
        </v-col>
      </v-row>
    </v-card>
    <div v-for="(question, index) in questions" :key="index">
      <SummaryCard
        :question="question"
        :index="index"
        v-if="
          //@ts-ignore
          !question.group_name
        "
      ></SummaryCard>
      <SummaryCardGroup :group="question" :index="index" v-else></SummaryCardGroup>
    </div>
    <v-btn
      style="position: fixed; bottom: 25px; right: 45px"
      icon="mdi-chevron-up"
      size="x-large"
      v-if="anchorUpShow"
      @click="goToUp"
    ></v-btn>
  </div>
</template>

<script setup lang="ts">
import SummaryCardGroup from "./components/SummaryCardGroup.vue";
import SummaryCard from "@/components/SummaryCard.vue";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
const { questionnaire } = storeToRefs(useQuestionnaireStore());
const anchorUpShow = ref(false);
const goToUp = () => {
  window.scrollTo(0, 0);
};

window.addEventListener("scroll", () => {
  if (window.scrollY >= 150) {
    anchorUpShow.value = true;
  } else {
    anchorUpShow.value = false;
  }
});

const questions = computed(() => {
  const groups: any = [];
  const noGroup: any = [];
  questionnaire.value.questions.forEach((question, index) => {
    if (!question.group) {
      noGroup.push(questionnaire.value.questions[index]);
    } else {
      const group_name = questionnaire.value.questions[index].group;
      const group = groups.find((item: any) => item.group_name == group_name);
      if (group) {
        group.questions.push(questionnaire.value.questions[index]);
      } else {
        groups.push({
          group_name,
          index: questionnaire.value.questions[index].index,
          questions: [questionnaire.value.questions[index]],
          is_group: true,
        });
      }
    }
  });
  return (
    groups
      //@ts-ignore
      .sort((a, b) => {
        return a.group_name.localeCompare(b.group_name);
      })
      .concat(
        noGroup.sort((a: any, b: any) => {
          return a.index - b.index;
        })
      )
  );
});
</script>

<style scoped></style>
