<template>
  <v-container class="h-100 w-100 d-flex justify-center align-center">
    <v-card class="rounded-lg" width="650">
      <div class="d-flex align-center flex-column pa-15">
        <h3 class="mb-5 font-weight-regular text-center">
          You have existing response to
          <strong>{{ questionnaire.title }}</strong>
          questionnaire, do you want to
        </h3>
        <div>
          <v-btn
            class="text-capitalize"
            color="primary"
            @click="
              $router.replace({ name: 'response.question', params: { question_id: 1 } })
            "
            :disabled="!first_question"
            :loading="loading"
            flat
            >continue</v-btn
          >
          <span class="mx-2">|</span>
          <v-btn
            class="text-capitalize"
            color="blue-darken-1"
            :disabled="!first_question"
            @click="getStarted"
            :loading="loading"
            flat
            >Start Again</v-btn
          >
        </div>
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
    router.push({ name: "response.question", params: { question_id: 1 } });
  });
};
</script>

<style scoped></style>
