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
  <main centre="" :style="style">
    <slot></slot>
  </main>
</template>

<style scoped>

[centre] {

  --element-origin-x:         0px;
  --element-origin-y:         0px;

  --left:                     calc( val(--element-origin-x) + 50% );
  --top:                      calc( val(--element-origin-y) + 50% );

  left:                       val(--left);
  top:                        val(--top);

  margin-left:                calc( -1 * val(--left) );
  margin-top:                 calc( -1 * val(--top) );

}

</style>
