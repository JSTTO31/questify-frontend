<template>
   <v-dialog width="750" :model-value="showDialog" @click:outside="emits('update:showDialog', false)">
    <v-card class="pa-8 rounded-lg">
      <h2 class="font-weight-regular mb-5">Select Question type</h2>
      <h4 class="mb-2 font-weight-regular">General</h4>
      <v-row>
        <v-col cols="4" v-for="category in types" :key="category.value">
          <v-card :variant="isSelected(category.value) ? 'outlined' : 'text'" :color="isSelected(category.value) ? 'primary' : 'black'" @click="select = category.value" class="pa-5" :class="isSelected(category.value) ? '' : 'border'" flat >
            <v-icon class="mr-2">{{ category.icon }}</v-icon>
            {{ category.label }}
          </v-card>
        </v-col>
      </v-row>
      <v-switch inset label="Group" class="mt-5" v-model="group" color="primary"></v-switch>
      <div class="mt-5 d-flex">
        <v-spacer></v-spacer>
        <v-btn variant="elevated" size="large" color="primary" prepend-icon="mdi-plus" :disabled="!select">Create</v-btn>
      </div>
      <span style="position: absolute;top: 15px;right: 15px;">
        <v-btn icon="mdi-close" @click="emits('update:showDialog', false)"></v-btn>
      </span>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import useQuestionnaire from '@/composables/useQuestionnaire';
defineProps(['showDialog'])
const group = ref(false)
const emits = defineEmits(['update:showDialog'])
const {types} = useQuestionnaire()
const select = ref('')
const isSelected = computed(() => (value: string) => select.value == value)
</script>

<style lang="scss" scoped>

</style>
