<template>
  <v-container class="h-100 w-100 d-flex justify-center align-center">
    <v-card class="rounded-lg" width="650">
      <div class="pa-15 pb-5 d-flex flex-column justify-center align-center">
        <v-avatar size="150" class="rounded-0">
          <v-img src="/src/assets/examination.png"></v-img>
        </v-avatar>
        <h1 class="text-center">{{ questionnaire.title }}</h1>
        <p class="text-center">{{ questionnaire.subtitle }}</p>
      </div>
      <div
        class="d-flex pt-5 pb-15 w-100 align-center justify-center"
        v-if="questionnaire.accept_responses"
      >
        <v-btn
          color="secondary"
          :disabled="!first_question"
          @click="getStarted"
          :loading="loading"
          >Get's Started</v-btn
        >
      </div>
      <div v-else class="d-flex pt-5 pb-15 w-100 align-center justify-center">
        <h2 class="font-weight-medium text-error">
          <v-icon>mdi-alert-circle</v-icon>
          Not Available
        </h2>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import useRespondent from "@/composables/useRespondent";
import { useRespondentStore } from "@/store/respondent";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
const $respondent = useRespondentStore();
const { questionnaire, response } = storeToRefs(useRespondentStore());
const { first_question } = useRespondent();
const router = useRouter();
const loading = ref(false);
const getStarted = () => {
  loading.value = true;
  $respondent.createResponse().then((response) => {
    loading.value = false;
    const routeData = router.resolve({
      name: "response.question",
      params: { question_id: 1 },
    });
    window.open(routeData.href, "_self");
  });
};
</script>

<style scoped></style>
