class CustomTimeline extends DocumentTimeline {
  constructor( options ) {
    super( options );

    this._dt = this.originTime;

  }

  get currentTime() {
    return this._dt;
  }

  set currentTime( dt ) {
    //  No
  }

  get dt() {

    return this._dt;
    
  }

  set dt( new_dt ) {

    this._dt += new_dt;
    
  }

  reset() {

    this._dt = this.originTime;

  }

}


export default CustomTimeline;