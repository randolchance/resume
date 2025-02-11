<script setup>
import { reactive } from 'vue';
import PageHeaderOption from './PageHeaderOption.vue';

import { EFFECTS_ENUM } from '@/effects/effects';

const options = reactive({
  HOME: {
    effect: EFFECTS_ENUM.focusIn,
  }
})

</script>

<template>
  <header id="control-bar">
    <PageHeaderOption
      v-for="( option, key ) in options"
      :key="key"
      :details="option"
    >
      {{ key }}
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
