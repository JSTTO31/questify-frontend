<template>
  <Pie :data="data" :options="options"></Pie>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";
ChartJS.register(ArcElement, Tooltip, Legend);
const props = defineProps(["datasets", "labels"]);

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: [
        "#57375D",
        "#FF3FA4",
        "#FF9B82",
        "#FFC8C8",
        "#EFB495",
        "#EFD595",
        "#EBEF95",
        "#FBF0B2",
        "#D8B4F8",
        "#CAEDFF",
        "#97FFF4",
      ],
      data: props.datasets,
      borderWidth: 1,
      borderColor: "#000",
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        font: {
          size: 15,
        },
        padding: 25,
      },
    },
    title: {
      display: true,
      text: "Custom Chart Title",
      padding: {
        top: 10,
        bottom: 30,
      },
    },
  },
};
</script>

<style scoped></style>
data
