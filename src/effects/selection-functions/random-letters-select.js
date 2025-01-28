import SelectionFunction from "./selection-function";
import { randomlyBreakUpElementContent, DEFAULT_WRAP_PARAMS } from "../tools";


class RandomLettersEffect extends SelectionFunction {

  static _selectionFunction = randomlyBreakUpElementContent;

  static defaults = DEFAULT_WRAP_PARAMS;

  static pattern = this.defaults.pattern;
  static min_span_length = this.defaults.min_span_length;
  static span_class_name = this.defaults.span_class_name;
  static container_class_names = this.defaults.container_class_names;
  static container = this.defaults.container;

  static getParams( params={} ) {
    return Object.assign( super.getParams( params ), {
      pattern: this.defaults.pattern,
      min_span_length: this.defaults.min_span_length,
    } );
  }

}


export default RandomLettersEffect;