<template>
  <v-card
    class="pa-5 py-3 border rounded-lg d-flex mb-3"
    @click="
      $router.push({
        name: 'questionnaire.show',
        params: { questionnaire_id: questionnaire.id },
      })
    "
    flat
  >
    <v-row class="d-flex align-center">
      <v-col cols="6">
        <v-card-title>{{ questionnaire.title }}</v-card-title>
        <v-card-subtitle>{{ questionnaire.subtitle }}</v-card-subtitle>
      </v-col>
      <v-col cols="2" class="text-grey-darken-3">
        <v-card-text class="d-flex align-center">
          <div class="h-100 w-100 d-flex align-center justify-center flex-column">
            <h3 class="text-center mb-2">{{ questionnaire.responses_count || 0 }}</h3>
            <h5 class="d-flex align-center">
              <v-icon class="mr-2">mdi-account</v-icon>
              Responses
            </h5>
          </div>
        </v-card-text>
      </v-col>
      <v-divider vertical inset></v-divider>
      <v-col cols="2" class="text-grey-darken-3">
        <v-card-text class="d-flex align-center">
          <div class="h-100 w-100 d-flex align-center justify-center flex-column">
            <h3 class="text-center d-flex align-center mb-2">
              {{ questionnaire.limit }}/{{ questionnaire.questions_count }}
              <v-tooltip>
                <template #activator="{ props }">
                  <v-icon v-bind="props" size="20" class="ml-2"
                    >mdi-information-outline</v-icon
                  >
                </template>
                The number of question is {{ questionnaire.questions_count }}, and the
                limit is {{ questionnaire.limit }}
              </v-tooltip>
            </h3>
            <h5 class="d-flex align-center">
              <v-icon class="mr-2">mdi-note-multiple</v-icon>
              questions
            </h5>
          </div>
        </v-card-text>
      </v-col>
      <v-divider vertical inset></v-divider>
      <v-col cols="2" class="text-grey-darken-3">
        <v-card-text class="d-flex align-center">
          <div class="h-100 w-100 d-flex align-center justify-center">
            <v-btn
              variant="text"
              class="mr-2"
              size="large"
              rounded="lg"
              color="grey"
              @click.stop="showUpdateDialog = true"
              icon="mdi-pencil-outline"
            ></v-btn>
            <v-btn
              variant="text"
              size="large"
              rounded="lg"
              color="error"
              @click.stop="showDeleteDialog = true"
              icon="mdi-trash-can-outline"
            ></v-btn>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
    <DialogQuestionnaireEdit
      v-model:show-dialog="showUpdateDialog"
      :questionnaire="questionnaire"
    ></DialogQuestionnaireEdit>
    <DialogQuestionnaireDeleteVue
      v-model:show-dialog="showDeleteDialog"
      :questionnaire="questionnaire"
    ></DialogQuestionnaireDeleteVue>
  </v-card>
</template>

<script setup lang="ts">
import DialogQuestionnaireDeleteVue from "./DialogQuestionnaireDelete.vue";
import DialogQuestionnaireEdit from "@/components/DialogQuestionnaireEdit.vue";
import { Questionnaire } from "@/store/questionnaire";
import { ref } from "vue";
const showUpdateDialog = ref(false);
const showDeleteDialog = ref(false);
const props = defineProps<{ questionnaire: Questionnaire }>();
</script>

<style scoped></style>
