<template>
  <v-dialog
    width="450"
    :model-value="showDialog"
    @click:outside="emits('update:showDialog', false)"
  >
    <v-card class="rounded-lg pa-10">
      <h3 class="mb-4">Change Password</h3>
      <v-text-field
        v-model="$v.old_password.$model"
        variant="outlined"
        :error-messages="showError($v.old_password)"
        class="mb-2"
        label="Old password"
        type="password"
      ></v-text-field>
      <v-text-field
        v-model="$v.password.$model"
        variant="outlined"
        type="password"
        :error-messages="showError($v.password)"
        class="mb-2"
        label="New Password"
      ></v-text-field>
      <v-text-field
        type="password"
        v-model="$v.password_confirmation.$model"
        variant="outlined"
        :error-messages="showError($v.password_confirmation)"
        class="mb-2"
        label="Confirmation Password"
      ></v-text-field>

      <div class="d-flex mt-2">
        <v-btn
          color="primary"
          prepend-icon="mdi-lock-reset"
          @click="submit"
          class="text-capitalize"
          >Change</v-btn
        >
        <v-btn
          prepend-icon="mdi-reload"
          flat
          @click="$v.$reset()"
          class="text-capitalize ml-2"
        >
          clear
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { showError } from "@/composables/useUtilities";
import { reactive } from "vue";
import { required, sameAs, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { computed } from "vue";
import { ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
const props = defineProps(["showDialog"]);
const emits = defineEmits(["update:showDialog"]);
const $externalResults = ref({});
const change = reactive({
  old_password: "",
  password: "",
  password_confirmation: "",
});
const isLoading = ref(false);
const rules = {
  old_password: {
    required: helpers.withMessage("The old password is required!", required),
  },
  password: { required: helpers.withMessage("The new password is required!", required) },
  password_confirmation: {
    required: helpers.withMessage("The confirmation password is required!", required),
    sameAs: helpers.withMessage(
      "The confirmation password must equal to new password!",
      sameAs(computed(() => change.password))
    ),
  },
};

const $v = useVuelidate(rules, change, {
  $externalResults,
});

const $user = useUserStore();

const submit = async () => {
  if (!(await $v.value.$validate())) {
    return;
  }
  isLoading.value = true;
  $user
    .change_password(change)
    .then((response) => {
      $v.value.$reset();
      emits("update:showDialog", false);
      isLoading.value = false;
    })
    .catch((error) => {
      $externalResults.value = error.response.data;
      isLoading.value = false;
    });
};
</script>

<style scoped></style>
