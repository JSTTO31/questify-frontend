<template>
  <v-card v-bind="props" :class="isDrag ? 'bg-secondary' : ''" flat class="text-h5 h-100 d-flex flex-column" @dragstart="drag" draggable="true" @dragend="isDrag = false" style="cursor: grab;" >
    <div class="d-flex align-center justify-center">
      <v-icon size="25">mdi-drag-horizontal</v-icon>
    </div>
    <v-card-text>
      {{ answer.text }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Answer } from '@/store/questionnaire';
import { ref } from 'vue';
const isDrag = ref(false)
const props = defineProps<{answer: Answer}>()
const drag = (e: any) => {
  e.dataTransfer.setData("answer_index", props.answer.index.toString())
  isDrag.value = true
}


</script>

<style scoped>

</style>
