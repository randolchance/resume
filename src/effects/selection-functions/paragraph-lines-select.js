import SelectionFunction from "./selection-function";
import { wrapLinesOfElementContent, DEFAULT_WRAP_LINE_PARAMS } from "../tools";


class ParagraphLinesEffect extends SelectionFunction {

  static _selectionFunction = wrapLinesOfElementContent;

  static defaults = DEFAULT_WRAP_LINE_PARAMS;

  static span_class_name = this.defaults.span_class_name;
  static container_class_names = this.defaults.container_class_names;
  static container = this.defaults.container;

}


export default ParagraphLinesEffect;