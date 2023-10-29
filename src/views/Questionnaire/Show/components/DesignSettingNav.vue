<template>
  <v-navigation-drawer
    location="right"
    :key="selectedQuestion.random_id"
    :model-value="Object.keys(selectedQuestion).length > 0"
    width="300"
  >
    <div class="pa-5 h-100" style="overflow-y: auto" id="design-container">
      <h3 class="mb-3">Settings</h3>
      <div>
        <h4 class="mb-2 font-weight-regular">Variants</h4>
        <v-select
          :model-value="selectedQuestion.type"
          density="compact"
          variant="outlined"
          :items="types"
          item-title="label"
          item-value="value"
          :prepend-inner-icon="getCurrentIcon(selectedQuestion.type)"
        >
          <template #item="{ item }">
            <v-list-item
              :prepend-icon="getCurrentIcon(item.value)"
              :active="item.value == selectedQuestion.type"
              @click="update_question({ ...selectedQuestion, type: item.value })"
              >{{ item.title }}</v-list-item
            >
          </template>
        </v-select>
        <h4 class="mb-2 font-weight-regular">Answers</h4>
        <v-autocomplete
          single-line
          multiple
          :items="selectedQuestion.answers"
          label="Select answer keys"
          item-title="text"
          variant="outlined"
          density="compact"
          item-value="index"
          v-model="answer_keys"
          @update:model-value="
            update_question(
              //@ts-ignore
              { ...selectedQuestion, answer_keys: answer_keys }
            )
          "
        >
        </v-autocomplete>
        <h4 class="mb-2 font-weight-regular">Points</h4>
        <v-text-field
          type="number"
          :model-value="selectedQuestion.points"
          @change="($event: any) =>
        update_question({...selectedQuestion, points: $event.target.value})"
          label="Points"
          variant="outlined"
          density="compact"
          single-line
        ></v-text-field>
        <h4 class="mb-2 font-weight-regular">Group</h4>

        <v-menu v-model="showGroups" :open-on-click="false">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              @focus="showGroups = true"
              :model-value="selectedQuestion.group"
              @change="($event: any) =>
            //@ts-ignore
            update_question({...selectedQuestion, group: $event.target.value})"
              label="Group name"
              variant="outlined"
              density="compact"
              single-line
            ></v-text-field>
          </template>
          <v-card class="rounded-lg">
            <v-list>
              <v-list-item
                @click="select_group(selectedQuestion, group)"
                v-for="group in groups"
                :key="group"
                :title="group"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <h4 class="mb-2 font-weight-regular">Auto Check</h4>
        <v-switch
          :model-value="selectedQuestion.auto_check"
          density="compact"
          color="primary"
          inset
          @change="($event: any) =>
        //@ts-ignore
        update_question({...selectedQuestion, auto_check: $event.target.checked})
        "
        ></v-switch>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import useQuestionnaire from "../../../../composables/useQuestionnaire";
import { storeToRefs } from "pinia";
import { Question, useQuestionnaireStore } from "../../../../store/questionnaire";
const { types, getCurrentIcon, update_question } = useQuestionnaire();
const { selectedQuestion, questionnaire } = storeToRefs(useQuestionnaireStore());
const answer_keys = ref(null);
const showGroups = ref(false);
const groups = computed(() => {
  const groups: string[] = [];

  questionnaire.value.questions.forEach((question: Question) => {
    if (question.group) {
      groups.push(question.group);
    }
  });

  return [...new Set(groups)];
});
const select_group = (question: Question, group: string) => {
  //@ts-ignore
  update_question({ ...question, group });
};
watchEffect(() => {
  //@ts-ignore
  answer_keys.value = selectedQuestion.value.answer_keys
    ? selectedQuestion.value.answer_keys
    : null;
});
</script>

<style scoped>
#design-container {
  transition: all 0.2s linear;
}

#design-container:hover::-webkit-scrollbar-thumb {
  background-color: rgb(165, 165, 165);
}

#design-container::-webkit-scrollbar {
  width: 7px;
}

#design-container::-webkit-scrollbar-thumb {
  background-color: #ffffff;
  border-radius: 50px;
}
</style>
