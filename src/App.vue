<script setup>
import PRNG from '@/utils/prng';
import PageHeader from './components/PageHeader.vue';

const rng_seeds = {}

function setSeed( period, scale ) {

  PRNG.scale = period
  PRNG.period = scale

  const rng = new PRNG()
  rng_seeds.default = rng

  document.body.setAttribute( 'seed', rng.seed )

}

function onWindowLoad() {

  //  Pattern repeats every 4000 minutes (60k ms)
  setSeed( 4000, 60000 )

}

window.onload = onWindowLoad

</script>

<template>
  <PageHeader></PageHeader>
</template>

<style scoped>

#app {

  width:                    100vw;
  height:                   100vh;

}

</style>
