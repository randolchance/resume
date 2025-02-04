import { addCssLink } from './tools';

export * from './selection-functions/letter-by-letter-select';
export * from './selection-functions/paragraph-lines-select';
export * from './selection-functions/random-letters-select';
export * from './selection-functions/word-by-word-select';


addCssLink('./effects.css');

let effects_enum = 1;
export const EFFECTS_ENUM = {

  focusIn:            effects_enum++,
  
}



export * from './coalesce';