<template>
  <v-app-bar flat style="padding-inline: 150px;" color="#57375D" v-if="!$route.name?.toString().includes('questionnaire.show')">
    <!-- <v-container class="d-flex align-center "> -->
      <h1 style="font-weight: 600;font-size: 35px;">Questify</h1>
      <div class="ml-15">
        <v-btn class="text-capitalize mr-2">Dashboard</v-btn>
        <v-btn class="text-capitalize mr-2">Questionnaires</v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-avatar class="bg-white">
        <v-img src="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"></v-img>
      </v-avatar>
      <v-icon class="ml-2">mdi-chevron-down</v-icon>
    <!-- </v-container> -->
  </v-app-bar>
</template>

<script lang="ts" setup>
</script>
