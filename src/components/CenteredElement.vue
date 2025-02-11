<script setup>
import { computed, defineProps, reactive } from 'vue';

const props = defineProps({
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
})


const style = reactive({
  '--element-origin-x': computed( () => `${ props.x }px` ),
  '--element-origin-y': computed( () => `${ props.y }px` ),
})

</script>

<template>
  <div centre :style="style">
    <slot></slot>
  </div>
</template>

<style scoped>

[centre] {

  position: relative;

  --element-origin-x:         0px;
  --element-origin-y:         0px;

  --left:                     calc( var(--element-origin-x) + 50% );
  --top:                      calc( var(--element-origin-y) + 50% );

  left:                       var(--left);
  top:                        var(--top);

  margin-left:                -50%;
  margin-top:                 -50%;

}

</style>
