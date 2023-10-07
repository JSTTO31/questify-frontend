<template>
  <v-card class="my-4 rounded-lg pa-8">
    <div class="d-flex mb-2 align-start">
      <h4>{{ index + 1 + ".  " + group.group_name }}</h4>
    </div>
    <div class="pl-15">
      <SummaryCard
        flat
        class="border-b"
        v-for="(question, index) in group.questions"
        :question="question"
        :index="index"
        :key="index"
      ></SummaryCard>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import SummaryCard from "@/components/SummaryCard.vue";

const props = defineProps<{
  group: any;
  index: number;
}>();
</script>

<style scoped></style>
