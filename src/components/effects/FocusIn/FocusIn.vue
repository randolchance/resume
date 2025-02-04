<script setup>
import { computed, defineProps, reactive, ref } from 'vue';
import { Color, Euler, Vector3 } from 'three';
import { is, Pointer, AXIS, RANGES, Range, PointSpace } from "@/vendor"

import FancyElement from '../FancyElement.vue'

import FiniteTimeline from '@/effects/finite-timeline'


const DEFAULT_COLOURS = [
  { start: "#12B536", end: "#D5FBDD" },
  { start: "#8712B5", end: "#F0D5FB" },
  { start: "#B51240", end: "#FBD5E0" },
]

let radius_type_enum = 0
const ORIGIN_TYPES = {
  constant:   radius_type_enum++,
  pointer:    radius_type_enum++,
}

const DEFAULTS = {
  colours: DEFAULT_COLOURS,
  colour_steps: 10,
  radius: {
    initial: 2500,
    final: 5
  },
  origin: {
    type: ORIGIN_TYPES.pointer,
    scale_factor: -2500,
  },
  span: {
    initial: RANGES.relative.radians.min,
    final: RANGES.relative.radians.max
  },
  alpha: {
    initial: 0,
    final: 1
  },
  blur_factor: {
    initial: 100,
    final: 0
  },
  centreAxis: AXIS.Y,
}


const props = defineProps({
  details: {
    type: Object,
    default: DEFAULTS,
  }
})

const details = reactive( props.details )

function colorToString( colour ) {
  return `#${ colour.getHexString() }`
}

function getElementPointSpace( element ) {
  const style = window.getComputedStyle( element )
  return new PointSpace()
    .fromArray( ['x','y','z'].map( axis => style.getPropertyValue(`--${ axis }`) ) )
}

function lerpColours( start_hex, target_hex, steps ) {
  const startColour = new Color( start_hex )
  const targetColour = new Color( target_hex )

  return Range.lerp.through( steps, { exclude_first: true, include_last: true } )
    .reduce( ( colours, u ) => {
      colours.push( colorToString( startColour.clone().lerpHSL( targetColour, u ) ) )
      return colours
    }, [ colorToString( startColour ) ] )
}

const steppedColourHexes = []
function createColourHexes( colourHexes=DEFAULTS.colours, steps=DEFAULTS.colour_steps ) {
  steppedColourHexes.splice( 0, Infinity, ...colourHexes.map(
    ({ start, end }) => lerpColours( start, end, steps )
  ) )

  return steppedColourHexes
}

const steppedColourVectors = []
function createColourVectors( direction_count, centre=DEFAULTS.centreAxis, span=DEFAULTS.span ) {
  const spanRange = new Range( span.initial, span.final )
  const include_last = is.near( spanRange.size, TAU, 0.001 )
  const vectors = span.through( direction_count, { include_last } )
    .map( angle => [ 1, 0, angle ] )

  steppedColourVectors.splice( 0, Infinity, ...vectors )

  return steppedColourVectors
}

const colourHexes = computed( () => createColourHexes( details ) )
const startColourHexes = computed( () => colourHexes.value.at(0) )
const colourVectors = computed( () => {
  const { centreAxis, span } = details
  return createColourVectors( startColourHexes.value.length, centreAxis, span )
} )


function updateTarget( target, pointer, params ) {
  switch (params.type) {

    default:
      return target

    case ORIGIN_TYPES.pointer:
      return new Vector3().subVectors( target, pointer )
        .divideScalar( -params.scale_factor )

  }
}

const animationTimeline = new FiniteTimeline()
function animateElement( event ) {

  const { origin } = details

  const bodyDimensions = document.body.getBoundingClientRect()
  const bodyCoordinates = new PointSpace( bodyDimensions.width, bodyDimensions.height )
    .divideScalar(2)

  const pointer = new Pointer( event, true )
  const pointerPointSpace = new PointSpace( pointer )
    .multiplyVectors( bodyCoordinates )

  const mainElement = event.target
  const targetPosition = mainElement.getBoundingClientRect()
  const targetPointSpace = new PointSpace( targetPosition.x, targetPosition.y )

  targetPointSpace.copy( updateTarget( targetPointSpace, pointerPointSpace, origin ) )

  const scale = targetPointSpace.length()

  const elements = mainElement.getElementsByClassName('focus-in-layer')
  for (const element of elements) {

    element.style.setProperty( '--scale', scale )

  }

  animationTimeline.u = scale

}

const hovering = ref(false)
function endAnimatingElement( event ) {

  const mainElement = event.target
  mainElement.removeEventListener( 'pointermove', animateElement )
  mainElement.removeEventListener( 'pointerup', endAnimatingElement )
  mainElement.removeEventListener( 'pointerleave', endAnimatingElement )
  mainElement.addEventListener( 'mouseenter', hoveringElement, {passive:true} )
  mainElement.addEventListener( 'touchstart', startAnimatingElement, {passive:true} )

  mainElement.getAnimations().forEach( animation => animation.cancel() )

  hovering.value = false
}

function hoveringElement( event ) {
  hovering.value = true

  startAnimatingElement( event )

}

function startAnimatingElement( event ) {

  const { alpha, radius, blur_factor, colours } = details

  const mainElement = event.target
  mainElement.removeEventListener( 'mouseenter', hoveringElement )
  mainElement.removeEventListener( 'touchstart', startAnimatingElement )
  mainElement.addEventListener( 'pointermove', animateElement, {passive:true} )
  mainElement.addEventListener( 'pointerup', endAnimatingElement, {passive:true} )
  mainElement.addEventListener( 'pointerleave', endAnimatingElement, {passive:true} )

  const radiusRange = new Range( radius.initial, radius.final )
  const opacityRange = new Range( alpha.initial, alpha.final )
  const blurRange = new Range( blur_factor.inital, blur_factor.final )

  const element_count = colours.length
  for (let index = 0; index < element_count; index++ ) {

    const steps = steppedColourHexes.length - 1

    const keyframes = []
    for (let i = 0; i <= steps; i++) {
      const u = i / steps

      const properties = {
        'offset': u,
        'color': colourHexes.value.at( i ).at( index ),
      }

      if ([0,1].includes( u )) {

        Object.assign( properties, {
          'opacity': opacityRange.lerp( u ),
          'filter': `blur(${ blurRange.lerp( u ) }px)`,
          '--radius': `${ radiusRange.lerp( u ) }px`
        } )

      }

      keyframes.push( properties )
    }

    const class_name = `focus-in-layer-${ index }`
    const [ element ] = document.getElementsByClassName( class_name )

    const frames = new KeyframeEffect( element, keyframes )
    const animation = new Animation( frames )
    animation.play()

  }

  animationTimeline.reset()

  mainElement.animate([
    { '--scale': 0 },
    { '--scale': 1 }
  ], { timeline: animationTimeline } )

}

const classes = computed( () => {
  const classes = []

  if (hovering.value) {

    classes.push('latch')

  }

  return classes
} )

</script>

<template>
  <FancyElement
    latch-hover="on"
    spherical="on"
    scale
    :class="classes"
    @mouseenter="hoveringElement"
    @touchstart="startAnimatingElement"
  >
    <FancyElement
      cylindrical="on"
      scale
      class="focus-in-layer"

      v-for="i in details.colours.length"
      :element-index="i"
      :--phi="colourVectors.at( i ).at(1)"
      :--theta="colourVectors.at( i ).at(2)"
      :class="`focus-in-layer-${ i }`"
    >
      <slot></slot>
    </FancyElement>
  </FancyElement>
</template>

<style scoped>

.focus-in-layer {

  --dt:                   1000;

  animation-duration:     var(--dt);

}


</style>
