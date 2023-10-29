<template>
  <div class="text-white">
    <v-card>
      <v-card class="bg-primary pa-5">
        <h3>{{ group.group_name }}</h3>
      </v-card>

      <div
        v-for="(question, n) in group.questions"
        :question="question"
        :key="question.id"
      >
        <h5 class="px-5 pt-5">
          Question {{ n + 1 }}: <span class="font-weight-regular">Multiple Choice</span>
        </h5>
        <ListGroupItemContainer :question="question"></ListGroupItemContainer>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import ListGroupItemContainer from "./ListGroupItemContainer.vue";
defineProps(["group"]);
</script>

<style scoped></style>
