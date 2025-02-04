<script setup>
import { reactive } from 'vue';
import PageHeaderOption from './PageHeaderOption.vue';

const options = reactive({
  HOME: {

  }
})

</script>

<template>
  <header id="control-bar">
    <PageHeaderOption
      v-for="label in options"
      :key="label"
      :details="options[ label ]"
    >
      {{ label }}
    </PageHeaderOption>
  </header>
</template>

<style scoped>

#control-bar {

  display: flex;
  justify-content: space-evenly;
  align-items: center;

}

</style>
