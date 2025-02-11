import { is, Range } from "@/vendor";

import CustomTimeline from "./custom-timeline";

const { abs } = Math;

class FiniteTimeline extends CustomTimeline {
  constructor( duration=1000, options ) {
    super( options )

    this._duration = new Range( 0, abs( duration ) );

  }

  get u() {
    return this._duration.clamp( this.dt ) / this.duration;
  }

  set u( new_u ) {
    if (!is.number( new_u )) {

      throw new Error(`Invalid value for u (should be on range [0,1]). Given: ${ new_u }`);

    }

    this.dt = new_u * this.duration;

  }

  get duration() {
    return this._duration.size;
  }

  set duration( new_duration ) {

    this._duration.max = new_duration;

  }

}


export default FiniteTimeline;