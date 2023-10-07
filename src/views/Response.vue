<template>
  <v-app>
    <!-- <v-navigation-drawer  :model-value="showQuestionList && $route.name == 'response.question'" width="300">
      <v-card class="h-100 w-100" style="z-index: 55000;overflow-y: auto;">
        <v-card-title class="d-flex align-center">
          Question List
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" size="small" @click="showQuestionList = false"></v-btn>
        </v-card-title>
        <v-list>
          <v-list-item :active="$question.id == question.id" color="primary" style="user-select: none;" @click="$router.push({name: 'response.question', params: {question_id: $question.id}})" v-for="$question, n in questionnaire.questions" :key="$question.id" >
            <v-card-title class="font-weight-regular text-subtitle-2 pa-0" >{{n + 1}}. {{ $question.text }}</v-card-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-navigation-drawer> -->
    <v-app-bar
      height="35"
      flat
      class="text-white text-h6 pa-10 px-15 font-weight-regular"
      color="transparent"
      style="z-index: 100"
      v-if="route.name == 'response.question'"
    >
      <v-spacer></v-spacer>
      <v-icon>mdi-timer</v-icon>
      Timer {{ timer }}
    </v-app-bar>
    <v-main
      class="d-flex align-center justify-center h-100"
      style="background-color: #57375d; padding-inline: 200px"
    >
      <RouterView v-slot="{ Component }">
        <Transition :name="$route.meta.transition?.toString() || 'slide'" mode="out-in">
          <component :key="question" :is="Component"></component>
        </Transition>
      </RouterView>
    </v-main>
    <span
      style="position: fixed; top: 30px; left: 40px; z-index: 100"
      v-if="$route.name == 'response.question'"
    >
      <v-card
        class="rounded-circle"
        color="transparent"
        style="user-select: none"
        @click="showQuestionList = true"
      >
        <v-progress-circular
          color="primary"
          :model-value="((currentIndex + 1) / questionnaire.questions.length) * 100"
          size="150"
          width="8"
          class="text-h5 font-weight-medium"
          >{{ currentIndex + 1 }}/{{
            questionnaire.questions.length
          }}</v-progress-circular
        >
      </v-card>
    </span>
    <span
      style="position: fixed; bottom: 50px; right: 80px; z-index: 50000"
      v-if="$route.name == 'response.question'"
    >
      <v-btn
        class="ml-5 rounded-circle"
        :size="90"
        @click="currentResponseQuestion.marked = true"
        v-if="currentResponseQuestion && !currentResponseQuestion.marked"
      >
        <v-icon size="40">mdi-lightbulb-outline</v-icon>
      </v-btn>
      <v-btn
        class="ml-5 rounded-circle"
        color="primary"
        :size="90"
        @click="currentResponseQuestion.marked = false"
        v-if="currentResponseQuestion && currentResponseQuestion.marked"
      >
        <v-icon size="40">mdi-lightbulb</v-icon>
      </v-btn>
    </span>
    <v-footer
      app
      v-if="$route.name == 'response.question'"
      class="pb-5"
      color="transparent"
    >
      <div class="d-flex" style="padding-inline: 200px; width: 100%; z-index: 50000">
        <v-spacer></v-spacer>
        <v-btn
          append-icon="mdi-arrow-right"
          :disabled="!links.nextQuestion"
          @click="
            $router.push({
              name: 'response.question',
              params: { question_id: currentIndex + 2 },
            })
          "
          size="x-large"
          color="primary"
          v-if="last_question.id != question.id && !response.reviewed"
          >Next Question</v-btn
        >

        <div class="d-flex">
          <v-btn
            color="primary"
            size="x-large"
            class="ml-4"
            @click="showSubmit = true"
            v-if="last_question.id == question.id || response.reviewed"
            >Submit</v-btn
          >
          <v-btn
            color="secondary"
            size="x-large"
            class="ml-4"
            @click="review"
            v-if="last_question.id == question.id || response.reviewed"
            >Review</v-btn
          >
        </div>
      </div>
    </v-footer>
    <!-- Submit Confirmation Dialog  -->
    <v-dialog v-model="showSubmit" width="700" style="z-index: 500000">
      <v-card class="d-flex flex-column justify-center align-center pa-15 rounded-xl">
        <v-avatar class="rounded-0" size="180">
          <v-img src="/src/assets/request.png"></v-img>
        </v-avatar>
        <h1 class="text-center mt-2 text-grey-darken-3">
          Are you sure you want to submit the questionnaire?
        </h1>
        <v-alert type="info" variant="tonal" color="info" class="mt-5 mb-2">
          Before you submit your questionnaire, please take a moment to review your
          responses. Once submitted, you will not be able to make any changes or
          corrections
        </v-alert>
        <div class="d-flex w-100 mt-5">
          <v-btn class="mr-5 rounded-lg" size="x-large" color="primary" @click="submit"
            >Submit</v-btn
          >
          <v-btn class="mr-5 rounded-lg" flat size="x-large" @click="showSubmit = false"
            >Cancel</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import useRespondent from "@/composables/useRespondent";
import { useRespondentStore } from "@/store/respondent";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { ref, provide } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
const router = useRouter();
const $respondent = useRespondentStore();
const showQuestionList = ref(false);
const { question, questionnaire, response, times_up } = storeToRefs(useRespondentStore());
const {
  timer,
  clock,
  currentIndex,
  currentResponseQuestion,
  links,
  last_question,
  submit,
  review,
  showSubmit,
} = useRespondent();
const route = useRoute();
provide("timer", timer);

onMounted(() => {
  let interval: any = null;

  if (response.value && response.value.submitted_at) {
    times_up.value = true;
  }

  if (!(route.name == "response.index" || route.name == "response.options")) {
    interval = setInterval(() => {
      clock.value = new Date();

      if (timer.value == -1) {
        if (!response.value.submitted_at) {
          $respondent.submitResponse().then(() => {
            router.push({
              name: "response.success",
              params: { questionnaire_id: questionnaire.value.id },
            });
          });
        }
        times_up.value = true;
        clearInterval(interval);
      }
    }, 1000);
  }
});

$respondent.$subscribe(() => {
  localStorage.setItem("response", JSON.stringify(response.value));
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.18s linear;
}

.slide-leave-active {
  transition-delay: 0.2s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-10%);
}

.scale-enter-active,
.scale-leave-active {
  transition: opacity 0.2s ease, transform 0.18s linear;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.18s linear;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
