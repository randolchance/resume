<script setup>
import { defineProps } from 'vue';

import FancyButton from './FancyButton.vue';

const props = defineProps({
  details: {
    type: Object,
    required: true,
  }
})

</script>

<template>
  <FancyButton :details="details" />
</template>

<style scoped>




</style>
