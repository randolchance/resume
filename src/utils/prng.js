const { floor } = Math;

//  This config presumes epoch time is passed
const DEFAULT_TIMESCALE = 100;  //  dSeed = 100ms
const DEFAULT_PERIOD = 10000;   //  Number of possible outcomes


const CONFIG = {
  scale: DEFAULT_TIMESCALE,
  period: DEFAULT_PERIOD,

  defaults: {
    scale: DEFAULT_TIMESCALE,
    period: DEFAULT_PERIOD,
  }
}

CONFIG.reset = function() {
  CONFIG.scale = CONFIG.defaults.scale;
  CONFIG.period = CONFIG.defaults.period;
}

function getSeedFromTime( time=Date.now(), period=CONFIG.period, scale=CONFIG.scale ) {
  return floor( time / scale ) % period;
}

function getSeedFromNow() {
  return getSeedFromTime();
}

function getNumber( seed, time=Date.now(), period=CONFIG.period, scale=CONFIG.scale ) {
  const scaled_time = getSeedFromTime( time, period, scale );
  return (scaled_time + seed) % period;
}

function getRandomNumber( seed, period, scale ) {
  return getNumber( seed, null, period, scale );
}


class PRNG {

  static get config() {
    return CONFIG;
  }

  static get seed() {
    return getSeedFromNow();
  }

  static valueOf() {
    const { period, scale } = this.config;
    return getRandomNumber( this.seed, period, scale ) / period;
  }

  constructor( time=null, period=PRNG.config.period, scale=PRNG.config.scale ) {

    this._period = period;
    this._scale = scale;

    this.time = time || Date.now();

  }

  get period() {
    return this._period;
  }

  get scale() {
    return this._scale;
  }

  get seed() {
    return getSeedFromTime( this.time, this.period, this.scale );
  }

  valueOf() {
    return getRandomNumber( this.seed, this.period, this.scale ) / this.period;
  }

  getRandomNumber() {
    return this.valueOf();
  }

  getNumber( time ) {
    return getNumber( this.seed, time, this.period, this.scale ) / this.period;
  }

}


export default PRNG;