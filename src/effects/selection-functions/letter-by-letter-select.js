import SelectionFunction from "./selection-function";
import { wrapLettersOfElementContent, DEFAULT_WRAP_LETTER_PARAMS } from "../tools";


class LetterByLetterEffect extends SelectionFunction {

  static _selectionFunction = wrapLettersOfElementContent;

  static defaults = DEFAULT_WRAP_LETTER_PARAMS;

  static span_class_name = this.defaults.span_class_name;
  static container_class_names = this.defaults.container_class_names;
  static container = this.defaults.container;

}


export default LetterByLetterEffect;