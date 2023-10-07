<template>
  <v-app-bar
    flat
    style="padding-inline: 150px"
    color="#57375D"
    v-if="!$route.name?.toString().includes('questionnaire.show')"
  >
    <!-- <v-container class="d-flex align-center "> -->
    <h1 style="font-weight: 600; font-size: 35px">Questify</h1>
    <div class="ml-15">
      <v-btn class="text-capitalize mr-2">Dashboard</v-btn>
    </div>
    <v-spacer></v-spacer>
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          class="ml-2"
          icon="mdi-chevron-down"
          variant="outlined"
        ></v-btn>
      </template>
      <v-card width="250">
        <v-list>
          <v-list-item
            prepend-icon="mdi-lock-outline"
            @click="showChangePasswordDialog = true"
            >Change password</v-list-item
          >
          <v-list-item prepend-icon="mdi-logout" @click="$user.logout()"
            >Sign out</v-list-item
          >
        </v-list>
      </v-card>
    </v-menu>
    <DialogChangePasswordVue
      v-model:show-dialog="showChangePasswordDialog"
    ></DialogChangePasswordVue>
    <!-- </v-container> -->
  </v-app-bar>
</template>

<script lang="ts" setup>
import DialogChangePasswordVue from "@/components/DialogChangePassword.vue";
import { useUserStore } from "@/store/user";
import { ref } from "vue";
const showChangePasswordDialog = ref(false);
const $user = useUserStore();
</script>
