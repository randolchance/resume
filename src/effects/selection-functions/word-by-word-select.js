import SelectionFunction from "./selection-function";
import { wrapWordsOfElementContent, DEFAULT_WRAP_PARAMS } from "../tools";


class WordByWordEffect extends SelectionFunction {

  static _selectionFunction = wrapWordsOfElementContent;

  static defaults = DEFAULT_WRAP_PARAMS;

  static span_class_name = this.defaults.span_class_name;
  static container_class_names = this.defaults.container_class_names;
  static container = this.defaults.container;

}


export default WordByWordEffect;