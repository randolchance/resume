<script setup>
import { defineProps, ref } from 'vue';

import { EFFECTS_ENUM } from '@/effects/effects';

import CenteredElement from './CenteredElement.vue';
import FocusIn from './effects/FocusIn/FocusIn.vue';


const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
})

const effect_enum = ref( props.details.effect )
const disable = ref( props.details.disable || !Boolean( props.details.effect ) )
const focusInProps = ref( props.details.focusIn )

</script>

<template>
  <a href="#" class="button-container">
    <template v-if="disable">
      <CenteredElement class="button-label"><slot></slot></CenteredElement>
    </template>
    <template v-else>
      <template v-if="effect_enum === EFFECTS_ENUM.focusIn">
        <FocusIn class="button-label"
          :params="focusInProps"
        >
          <slot></slot>
        </FocusIn>
      </template>
      <!-- template v-else-if="effect_enum === EFFECTS_ENUM.focusIn">
        <FocusIn class="button-label">{{ label }}</FocusIn>
      </template -->
    </template>
  </a>
</template>

<style scoped>

.button-container {

  height: 100%;

}

.button-label {

  vertical-align: middle;
  text-align: center;

}

</style>
