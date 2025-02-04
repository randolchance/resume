<script setup>
import { defineProps } from 'vue';

import CenteredElement from './CenteredElement.vue';
import FocusIn from './effects/FocusIn/FocusIn.vue';

let effects_enum = 1;
const EFFECTS = {
  focusIn:            effects_enum++,

}

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
})

const disable = ref( props.details.disable )
const label = ref( props.details.label )
const effect_enum = ref( props.details.effect )

</script>

<template>
  <a href="#" class="button-container">
    <template v-if="disable">
      <CenteredElement class="button-label">{{ label }}</CenteredElement>
    </template>
    <template v-else>
      <template v-if="effect_enum === EFFECTS.focusIn">
        <FocusIn class="button-label">{{ label }}</FocusIn>
      </template>
      <!-- template v-else-if="effect_enum === EFFECTS.focusIn">
        <FocusIn class="button-label">{{ label }}</FocusIn>
      </template -->
    </template>
  </a>
</template>

<style scoped>

.button-container {

}

.button-label {

  vertical-align: middle;
  text-align: center;

}

</style>
