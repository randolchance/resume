<script setup>
import { computed, defineProps, reactive } from 'vue';
import CenteredElement from './CenteredElement.vue';

const DEFAULT_CAMERA_Z = 50

const props = defineProps({
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  z: {
    type: Number,
    default: 0,
  },
  camera_x: {
    type: Number,
    default: 0,
  },
  camera_y: {
    type: Number,
    default: 0,
  },
  camera_z: {
    type: Number,
    default: DEFAULT_CAMERA_Z,
  },
  element_origin_x: {
    type: Number,
    default: 0,
  },
  element_origin_y: {
    type: Number,
    default: 0,
  },
})

const style = reactive({
  '--x': computed( () => `${ props.x }px` ),
  '--y': computed( () => `${ props.y }px` ),
  '--z': computed( () => `${ props.z }px` ),
  '--camera-x': computed( () => `${ props.camera_x }px` ),
  '--camera-y': computed( () => `${ props.camera_y }px` ),
  '--camera-z': computed( () => `${ props.camera_z }px` ),
})

</script>

<template>
  <div
    :style="style"
    spatial="on"
  >
    <CenteredElement :x="element_origin_x" :y="element_origin_y">
      <slot></slot>
    </CenteredElement>
  </div>
</template>

<style scoped>

[spatial='on'] {

  --camera-x:                 0px;
  --camera-y:                 0px;
  --camera-z:                 0px;

  perspective-origin:         calc( 50% + var(--camera-x) ) calc( 50% + var(--camera-y) );
  perspective:                var(--camera-z);

  --x:                        0px;
  --y:                        0px;
  --z:                        0px;

  --rho:                      calc( hypot( var(--x) * 1px, var(--y) * 1px ) );

  --r:                        calc( hypot( var(--z) * 1px, var(--rho) * 1px ) );
  --theta:                    calc( atan2( var(--y), var(--x) ) );
  --phi:                      calc( atan2( var(--rho), var(--z) ) );

  transform:                  translate3d( var(--x), var(--y), var(--z) );

}

[spatial='on'][spherical='on'] {

  --radius:                   0px;
  --phi:                      0;
  --theta:                    0;

  --rho:                      calc( var(--radius) * cos( --phi ) );

  --x:                        calc( var(--rho) * cos( --theta ) );
  --y:                        calc( var(--rho) * sin( --theta ) );
  --z:                        calc( var(--radius) * sin( --phi ) );

}

[spatial='on'][cylindrical='on'],
[spatial='on'][cylindrical='on'][axis='z'] {

  --radius:                   0px;
  --theta:                    0;

  --x:                        calc( var(--radius) * cos( --theta ) );
  --y:                        calc( var(--radius) * sin( --theta ) );

  --rho:                      calc( hypot( var(--x) * 1px, var(--y) * 1px ) );

}

[spatial='on'][cylindrical='on'][axis='x'] {

  --y:                        calc( var(--radius) * cos( --theta ) );
  --z:                        calc( var(--radius) * sin( --theta ) );

}

[spatial='on'][cylindrical='on'][axis='y'] {

  --z:                        calc( var(--radius) * cos( --theta ) );
  --x:                        calc( var(--radius) * sin( --theta ) );

}

[spatial='on'][scale] {

  --scale:                    1;

  --scaled-x:                 calc( var(--scale) * var(--x) );
  --scaled-y:                 calc( var(--scale) * var(--y) );
  --scaled-z:                 calc( var(--scale) * var(--z) );

  --scaled-rho:               calc( var(--scale) * var(--rho) );

  --scaled-r:                 calc( var(--scale) * var(--r) );

  transform:                  translate3d( var(--scaled-x), var(--scaled-y), var(--scaled-z) );

}

</style>
