<template>
  <div style="padding-inline: 150px" v-if="Object.keys(respondent).length > 0">
    <v-card class="my-2 rounded-lg pa-5 d-flex align-center">
      <h3>IP Address: {{ respondent.ip_address }}</h3>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-chevron-left"
        class="rounded-lg ml-2"
        flat
        :disabled="!response_paginate_options.prev_page_url"
        @click="prev"
      ></v-btn>
      <v-btn
        icon="mdi-chevron-right"
        class="rounded-lg ml-2"
        flat
        :disabled="!response_paginate_options.next_page_url"
        @click="next"
      ></v-btn>
    </v-card>

    <div v-if="respondent.submitted_at">
      <IndividualCard
        class="rounded-lg pa-5 my-2"
        v-for="
          //@ts-ignore
          response_question, index in respondent.response_questions.filter(item => !!item.question)"
        :key="response_question.id"
        :response_question="response_question"
        :index="index"
      >
        {{ response_question }}
      </IndividualCard>
    </div>
    <v-card class="my-2 rounded-lg pa-5 d-flex align-center">
      <h3>IP Address: {{ respondent.ip_address }}</h3>
      <v-spacer></v-spacer>
      <v-btn
        icon="mdi-chevron-left"
        class="rounded-lg ml-2"
        flat
        :disabled="!response_paginate_options.prev_page_url"
        @click="prev"
      ></v-btn>
      <v-btn
        icon="mdi-chevron-right"
        class="rounded-lg ml-2"
        flat
        :disabled="!response_paginate_options.next_page_url"
        @click="next"
      ></v-btn>
    </v-card>
  </div>
  <div
    style="padding-inline: 150px"
    class="d-flex align-center justify-center text-h6 pt-15 h-100"
    v-else
  >
    No response
  </div>
</template>

<script setup lang="ts">
import IndividualCard from "./components/IndividualCard.vue";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { storeToRefs } from "pinia";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
const { respondent, response_paginate_options } = storeToRefs(useQuestionnaireStore());
const router = useRouter();
const $questionnaire = useQuestionnaireStore();
const next = () => {
  router.push({ query: { page: response_paginate_options.value.current_page + 1 } });
};
const prev = () => {
  router.push({ query: { page: response_paginate_options.value.current_page - 1 } });
};

onBeforeRouteUpdate((to, from, next) => {
  //@ts-ignore
  $questionnaire.get_response(to.query.page || "1");

  return next();
});
</script>

<style scoped></style>
