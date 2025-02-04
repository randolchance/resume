<script setup>
import { reactive } from 'vue';
import PageHeaderOption from './PageHeaderOption.vue';

const options = reactive({

})

</script>

<template>
  <header id="control-bar">
    <PageHeaderOption
      v-for="label in options"
      :key="label"
      :details="{ label, options: options[ label ] }"
    />
  </header>
</template>

<style scoped>

#control-bar {



}

</style>
