import { is } from "../../../vendor/nice-things/utils";
import { DEFAULT_PARAMS } from "../tools";


class SelectionFunction {

  static _selectionFunction = null;

  static defaults = DEFAULT_PARAMS;

  static span_class_name = this.defaults.span_class_name;
  static container_class_names = this.defaults.container_class_names;
  static container = this.defaults.container;

  static getParams( params={} ) {
    return Object.assign( params, {
      span_class_name: this.span_class_name,
      container_class_names: this.container_class_names,
      container: this.container,
    } );
  }

  static setParams( new_params={} ) {

    Object.assign( this, { ...this.defaults, ...new_params } );

  }

  static breakUpContentByClassName( class_name, rootElement=document ) {
    if (!is.function( this._selectionFunction )) {

      throw new Error(`A selection function has not been defined!`);

    }

    const elements = rootElement.querySelectorAll(`.${ class_name }`);
    elements.forEach( element => this._selectionFunction( element, this ) );
  }

}


export default SelectionFunction;