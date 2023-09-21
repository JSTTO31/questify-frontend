<template>
  <component :is="component"></component>
</template>

<script setup lang="ts">
import {shallowRef} from 'vue'
import Select from './Select.vue';
import Paragraph from './Paragraph.vue'
import MultipleChoices from './MultipleChoices.vue';
import Checkboxes from './Checkboxes.vue';
import Text from './Text.vue';
import { storeToRefs } from 'pinia';
import { useRespondentStore } from '@/store/respondent';
const component = shallowRef(MultipleChoices)
const {question} = storeToRefs(useRespondentStore())

if(question.value.type == 'check'){
  component.value = Checkboxes
}

if(question.value.type == 'paragraph'){
  component.value = Paragraph
}

if(question.value.type == 'select'){
  component.value = Select

}

if(question.value.type == 'text'){
  component.value = Text

}


</script>

<style scoped>

</style>
