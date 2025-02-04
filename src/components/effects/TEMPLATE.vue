<script setup>
import { defineProps } from 'vue';

import FancyElement from '../FancyElement.vue';

import { PointSpace } from '@/vendor';

const props = defineProps({
  details: {
    type: Object,
    required: true,
  }
})

const elementPosition = new PointSpace()
const position = {
  x: ref( elementPosition.x ),
  y: ref( elementPosition.y ),
  z: ref( elementPosition.z ),
}

const viewPosition = new PointSpace()
const cameraPosition = {
  x: ref( viewPosition.x ),
  y: ref( viewPosition.y ),
  z: ref( viewPosition.z ),
}






</script>

<template>
  <FancyElement
    :x="position.x"
    :y="position.y"
    :z="position.z"
    :camera_x="cameraPosition.x"
    :camera_y="cameraPosition.y"
    :camera_z="cameraPosition.z"
  >
    <slot></slot>
  </FancyElement>
</template>

<style scoped>




</style>
