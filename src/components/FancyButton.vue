<script setup>
import { defineProps } from 'vue';

import { EFFECTS_ENUM } from '@/effects/effects';

import CenteredElement from './CenteredElement.vue';
import FocusIn from './effects/FocusIn/FocusIn.vue';


const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
})

const disable = ref( props.details.disable || false )
const effect_enum = ref( props.details.effect )

</script>

<template>
  <a href="#" class="button-container">
    <template v-if="disable">
      <CenteredElement class="button-label"><slot></slot></CenteredElement>
    </template>
    <template v-else>
      <template v-if="effect_enum === EFFECTS_ENUM.focusIn">
        <FocusIn class="button-label"><slot></slot></FocusIn>
      </template>
      <!-- template v-else-if="effect_enum === EFFECTS_ENUM.focusIn">
        <FocusIn class="button-label">{{ label }}</FocusIn>
      </template -->
    </template>
  </a>
</template>

<style scoped>

.button-container {

  width: 100%;
  height: 100%;

}

.button-label {

  vertical-align: middle;
  text-align: center;

}

</style>
