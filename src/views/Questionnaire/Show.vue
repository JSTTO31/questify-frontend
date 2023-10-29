<template>
  <div class="bg-grey-lighten-4 h-100 w-100" fluid style="user-select: none">
    <v-app-bar flat height="100" class="pr-5" color="#57375D">
      <v-app-bar-nav-icon
        icon="mdi-arrow-left"
        @click="$router.push('/')"
      ></v-app-bar-nav-icon>
      <h1 class="font-weight-regular ml-5">{{ questionnaire.title }}</h1>
      <v-spacer></v-spacer>
      <v-btn class="mx-1" icon="mdi-eye-outline" variant="text" @click="preview"></v-btn>
      <v-btn
        class="mx-1"
        icon="mdi-undo"
        variant="text"
        :disabled="history.length < 1 || history_triggered_all"
        @click="undo"
      ></v-btn>
      <v-btn
        class="mx-1"
        icon="mdi-redo"
        variant="text"
        @click="redo"
        :disabled="history.length < 1 || history_not_triggered_all"
      ></v-btn>
      <v-btn class="mx-1" icon="mdi-reload" variant="text" @click="reload"></v-btn>
      <!-- <span class="mx-2">
        <v-switch v-model="questionnaire.accept_responses" @change="$questionnaire.update(questionnaire)" density="compact" label="Accept Reponses" color="primary" hide-details></v-switch>
      </span> -->
      <v-btn
        width="150"
        flat
        prepend-icon="mdi-link"
        variant="elevated"
        :disabled="copied"
        color="primary"
        class="text-capitalize mx-1"
        @click="copy"
      >
        {{ copied ? "Copied Link" : "Copy Link" }}
      </v-btn>
      <!-- <v-btn class="mx-1" icon="mdi-dots-vertical"></v-btn> -->
    </v-app-bar>
    <v-app-bar flat density="compact" class="border-b d-flex" color="grey-lighten-2">
      <v-tabs class="w-100 pr-15" density="compact" :model-value="$route.name">
        <v-spacer></v-spacer>
        <v-tab
          class="text-capitalize rounded-0"
          :to="{
            name: 'questionnaire.show.summary',
            params: { questionnaire_id: questionnaire.id },
          }"
          value="summary"
          prepend-icon="mdi-chart-arc"
          >Summary</v-tab
        >
        <v-tab
          prepend-icon="mdi-account-outline"
          class="text-capitalize rounded-0"
          :to="{
            name: 'questionnaire.show.individual',
            params: { questionnaire_id: questionnaire.id },
          }"
          >Analayze Individual</v-tab
        >
        <v-tab
          prepend-icon="mdi-pencil-box-multiple-outline"
          class="text-capitalize rounded-0"
          :to="{
            name: 'questionnaire.show.design',
            params: { questionnaire_id: questionnaire.id },
          }"
          value="design"
          >Build Questions</v-tab
        >
        <v-tab
          class="text-capitalize rounded-0"
          prepend-icon="mdi-cog-outline"
          :to="{
            name: 'questionnaire.show.configure',
            params: { questionnaire_id: questionnaire.id },
          }"
          >Configure</v-tab
        >
        <v-spacer></v-spacer>
      </v-tabs>
    </v-app-bar>
    <v-container>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useQuestionnaireStore } from "@/store/questionnaire";
import { group } from "console";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { ref } from "vue";
import { onMounted } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
const { questionnaire, history } = storeToRefs(useQuestionnaireStore());
const $questionnaire = useQuestionnaireStore();
const copied = ref(false);
const router = useRouter();
const history_triggered_all = computed(() =>
  history.value.every((item) => item.triggered)
);
const history_not_triggered_all = computed(() =>
  history.value.every((item) => !item.triggered)
);
const undo = () => {
  const lastHistory = history.value.findLast((item) => !item.triggered);

  if (lastHistory) {
    lastHistory.undo();
    lastHistory.triggered = true;
  }
};
const redo = () => {
  const lastHistory = history.value.find((item) => item.triggered);
  if (lastHistory) {
    lastHistory.redo();
    lastHistory.triggered = false;
  }
};
const remove_redo = () => {
  if (history.value.some((item) => item.triggered)) {
    const last_triggered_index = history.value.findLastIndex((item) => item.triggered);
    if (last_triggered_index) {
      history.value[last_triggered_index].triggered = false;
      history.value = history.value.slice(0, last_triggered_index + 1);
    }
  }
};

const preview = () => {
  const routeDate = router.resolve({
    name: "response.index",
    params: { questionnaire_id: questionnaire.value.id },
  });

  window.open(routeDate.fullPath, "_blank");
};
const copy = async () => {
  copied.value = true;
  const routeData = router.resolve({
    name: "response.index",
    params: { questionnaire_id: questionnaire.value.id },
  });
  const link = process.env.local_url + "" + routeData.href;
  const clipboard = await navigator.clipboard;
  clipboard.writeText(link);
};
const reload = () => {
  sessionStorage.removeItem("questionnaire");
  sessionStorage.removeItem("history");
  location.reload();
};

onMounted(() => {
  const local_questionnaire = JSON.parse(sessionStorage.getItem("questionnaire") || "{}");

  if (Object.keys(local_questionnaire).length > 0) {
    if (questionnaire.value.id == local_questionnaire.id) {
      questionnaire.value = local_questionnaire;
    }
  }
});
$questionnaire.$subscribe((mutation, state) => {
  //@ts-ignore
  if (mutation.payload) {
    //@ts-ignore
    if (mutation.payload.trigger == "add question") {
      //@ts-ignore
      const question = { ...mutation.payload.data.question };
      console.log(question);

      $questionnaire.add_question({
        ...question,
        answer_keys: question.answer_keys.join(","),
      });

      history.value.push({
        label: "add question",
        triggered: false,
        undo: () => {
          $questionnaire.remove_question(question.index);
        },
        redo: () => {
          $questionnaire.add_question({
            ...question,
            answer_keys: question.answer_keys.join(","),
          });
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "remove question") {
      //@ts-ignore
      const question = { ...mutation.payload.data.question };
      $questionnaire.remove_question(question.index);

      history.value.push({
        label: "remove question",
        triggered: false,
        redo: () => {
          $questionnaire.remove_question(question.index);
        },
        undo: () => {
          $questionnaire.add_question({ ...question, answers: [] }).then(() => {
            $questionnaire.add_answers(question.index, question.answers);
          });
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "remove questions") {
      //@ts-ignore
      const questions = [...mutation.payload.data.questions];
      $questionnaire.remove_questions(questions);

      history.value.push({
        label: "remove question",
        triggered: false,
        redo: () => {
          $questionnaire.remove_questions(questions);
        },
        undo: () => {
          $questionnaire
            .add_questions(questions.slice().map((item) => ({ ...item, answers: [] })))
            .then(() => {
              questions.forEach((question) => {
                $questionnaire.add_answers(question.index, question.answers);
              });
            });
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "update question") {
      //@ts-ignore
      const question = { ...mutation.payload.data.question };
      const before_question = {
        ...questionnaire.value.questions.find((item) => item.index == question.index),
      };

      $questionnaire.update_question(question);

      history.value.push({
        label: "update question",
        triggered: false,
        redo: () => {
          $questionnaire.update_question(question);
        },
        undo: () => {
          //@ts-ignore
          $questionnaire.update_question(before_question);
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "update questions") {
      //@ts-ignore
      const questions = [...mutation.payload.data.questions];
      const before_questions = [
        ...questionnaire.value.questions.filter((item) =>
          questions.some((question) => question.index == item.index)
        ),
      ];
      $questionnaire.update_questions(questions);

      history.value.push({
        label: "update questions",
        triggered: false,
        redo: () => {
          $questionnaire.update_questions(questions);
        },
        undo: () => {
          //@ts-ignore
          $questionnaire.update_question(before_questions);
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "add answer") {
      //@ts-ignore
      const question = { ...mutation.payload.data.question };
      //@ts-ignore
      const answer = { ...mutation.payload.data.answer };

      $questionnaire.add_answer(question.index, answer);

      history.value.push({
        label: "add answer",
        triggered: false,
        undo: () => {
          $questionnaire.remove_answer(question.index, answer.index);
        },
        redo: () => {
          $questionnaire.add_answer(question.index, answer);
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "remove answer") {
      //@ts-ignore
      const question = { ...mutation.payload.data.question };
      //@ts-ignore
      const answer = { ...mutation.payload.data.answer };
      $questionnaire.remove_answer(question.index, answer.index);

      history.value.push({
        label: "remove answer",
        triggered: false,
        undo: () => {
          $questionnaire.add_answer(question.index, answer);
        },
        redo: () => {
          $questionnaire.remove_answer(question.index, answer.index);
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "update answer") {
      //@ts-ignore
      const question = { ...mutation.payload.data.question };
      //@ts-ignore
      const answer = { ...mutation.payload.data.answer };
      const before_answer = {
        ...questionnaire.value.questions
          .find((item) => item.index == question.index)
          ?.answers.find((item) => item.index == answer.index),
      };

      $questionnaire.update_answer(question.index, answer);

      history.value.push({
        label: "update answer",
        triggered: false,
        redo: () => {
          $questionnaire.update_answer(question.index, answer);
        },
        undo: () => {
          //@ts-ignore
          $questionnaire.update_answer(question.index, before_answer);
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "remove group") {
      //@ts-ignore
      const group_name = mutation.payload.data.group_name;
      const questions = [
        ...questionnaire.value.questions.filter((item) => item.group == group_name),
      ];
      //@ts-ignore
      $questionnaire.remove_group(group_name);

      history.value.push({
        label: "remove group",
        triggered: false,
        redo: () => {
          $questionnaire.remove_group(group_name);
        },
        undo: () => {
          //@ts-ignore
          $questionnaire.group(group_name, questions);
        },
      });
    }

    //@ts-ignore
    if (mutation.payload.trigger == "group") {
      //@ts-ignore
      const group_name = mutation.payload.data.group_name;
      //@ts-ignore
      const questions = [...mutation.payload.data.questions];
      //@ts-ignore
      $questionnaire.group(group_name, questions);

      history.value.push({
        label: "group",
        triggered: false,
        redo: () => {
          $questionnaire.group(group_name, questions);
        },
        undo: () => {
          //@ts-ignore
          $questionnaire.remove_group(group_name);
        },
      });
    }
    remove_redo();
    sessionStorage.setItem("questionnaire", JSON.stringify(questionnaire.value));
    // sessionStorage.setItem("history", JSON.stringify(history.value));
  }
});

const contextmenufn = (e: any) => {
  e.preventDefault();
};

const keydownfn = (e: any) => {
  if (e.key == "z" && e.ctrlKey) {
    undo();
  }

  if (e.key == "y" && e.ctrlKey) {
    redo();
  }
};

window.addEventListener("contextmenu", contextmenufn);
window.addEventListener("keydown", keydownfn);

onBeforeRouteLeave((to, from, next) => {
  removeEventListener("contextmenu", contextmenufn);
  removeEventListener("keydown", keydownfn);

  next();
});
</script>

<style scoped></style>
