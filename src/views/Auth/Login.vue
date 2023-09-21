<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="background: #57375D">
      <v-card class="pa-5 rounded-lg px-10 py-15" width="500" >
        <h1 class="text-center" style="font-size: 55px;">Questify</h1>
        <v-card-text>
          <v-text-field @keyup.enter="submit" v-model="$v.email.$model" :error-messages="showError($v.email)" label="Email Address" variant="underlined" prepend-icon="mdi-email"></v-text-field>
          <v-text-field :type="showPassword ? 'text' : 'password'" @keyup.enter="submit" v-model="$v.password.$model" :error-messages="showError($v.password)" label="Password" variant="underlined" prepend-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showPassword = !showPassword"></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-btn block size="large" variant="elevated" color="primary" @click="submit" :loading="isLoading">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { required, email } from '@vuelidate/validators';
import { useUserStore } from '@/store/user';
import useVuelidate from '@vuelidate/core';
import { reactive } from 'vue';
import { ref } from 'vue';
import { showError } from '@/composables/useUtilities';
import { useRouter } from 'vue-router';
const router = useRouter()
const $user = useUserStore();
const isLoading = ref(false)
const showPassword = ref(false);
const credentials = reactive({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required },
};
const $externalResults = ref({})
const $v = useVuelidate(rules, credentials, { $externalResults });

const submit = async () => {
  if(!await $v.value.$validate()){
    return;
  }
  isLoading.value = true
  $user.login(credentials).catch(error => {
    $externalResults.value = error.response.data.errors
    isLoading.value=false
  })

};
</script>

<style scoped>

</style>
