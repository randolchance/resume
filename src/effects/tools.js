import PRNG from "@/utils/prng";
import { is } from "../../vendor/nice-things/utils";

const { max, floor } = Math;


function isWhitespace( character ) {
  if (!is.string( character ) || character.length !== 1) {

    throw new Error(`${ character } is not a character.`);

  }

  return /\s/.test( character );
}


const ELEMENT_NODE = 1;
const TEXT_NODE = 3;


const DEFAULT_PARAMS = {
  span_class_name: 'text-effect-layer',
  container_class_names: ['text-effect-container'],
  container: null,
}


const DEFAULT_BREAK_UP_PARAMS = {
  probabilityPattern: [1],
  min_span_length: 1,
  ...DEFAULT_PARAMS,
}

function* generateSpans( probabilityPattern, min_span_length ) {
  const length = probabilityPattern.length;

  let i = 0;
  while (length) {  //  Just protects against empty patterns, loops forever

    yield floor( new PRNG() * probabilityPattern[ i++ ] ) + min_span_length;

    i %= length;

  }
}

function breakUpText( text, params ) {

  const {
    probabilityPattern,
    min_span_length,
    span_class_name,
    container,
    container_class_names
  } = { ...DEFAULT_BREAK_UP_PARAMS, ...params };

  const layers = probabilityPattern.map( () => {
    const element = document.createElement('div');
    element.classList.add('inherit-parent');
    return element;
  } );
  
  const text_length = text.length;
  const size = layers.length;

  let span_index = 0;
  let text_index = 0;
  let class_index = 0;
  for (const span of generateSpans( probabilityPattern, min_span_length )) {

    const end_index = text_index + span;
    const content = text.slice( text_index, end_index );
    layers.forEach( ( layer, i ) => {
      const element = document.createElement('span');
      element.textContent = content;

      const class_name = i === class_index ? span_class_name : `${ span_class_name }-placeholder`;
      element.classList.add( class_name );

      element.setAttribute( 'layer', class_index );

      element.setAttribute( 'index', span_index );

      layer.appendChild( element );
    } );

    layers[ class_index ].push( element );

    span_index++;

    text_index = end_index;

    class_index = (class_index + 1) % size;

    if (text_index < text_length) continue;
    
    break;
  }

  container = container || document.createElement('div');
  container.classList.add( ...container_class_names );
  container.append( ...layers );
  return container;
}

function randomlyBreakUpElementContent( element, params ) {
  element.childNodes.forEach( node => {
    switch (node.nodeType) {

      case TEXT_NODE:
        const new_element = breakUpText( node.textContent, params );
        element.replaceChild( new_element, node );
        break;

      case ELEMENT_NODE:
        randomlyBreakUpElementContent( node, params );
        break;

      default:
        break;

    }
  } );
}


const DEFAULT_WRAP_PARAMS = {
  ...DEFAULT_PARAMS,
  min_span_length: null,
  span_fraction: 1,
}

function wrapText( text, class_names ) {
  const element = document.createElement('span');

  element.classList.add( ...class_names );
  element.textContent = text;

  return element;
}

function wrapWords( text, params ) {

  const {
    min_span_length,
    span_fraction,
    span_class_name,
    container,
    container_class_names,
  } = params;

  const layers = new Array(2).map( () => [] );

  const PRIMARY_LAYER = 0;
  const SECONDARY_LAYER = 1;

  let span_index = 0;
  let word_index = 0;
  for (const words = text.split(/\s/g); word_index < words.length; word_index++ ) {
    const word = words[ word_index ];
    const word_length = word.length;
    if (word_length === 0) continue;
    
    const span = max( span_fraction * word_length, min_span_length || word_length );

    const word_start = word.slice( 0, span );
    const word_end = word.slice( span );

    layers.forEach( ( layer, i ) => {
      const word_element = document.createElement('span');

      if (word_start.length > 0) {

        const word_class_name = i === PRIMARY_LAYER ?
          span_class_name :
          `${ span_class_name }-placeholder`;
  
        word_element.append( wrapText( word_start, word_class_name ) );
      
      }

      if (word_end.length > 0) {
        
        const word_class_name = i === SECONDARY_LAYER ?
          span_class_name :
          `${ span_class_name }-placeholder`;
  
        word_element.append( wrapText( word_end, word_class_name ) );

      }

      word_element.classList.add('word');

      word_element.setAttribute( 'layer', i );

      word_element.setAttribute( 'index', span_index++ );

      layer.push( word_element.outerHTML );

    } );

  }

  container = container || document.createElement('div');
  container.classList.add( ...container_class_names );

  const elements = layers
    .filter( layer => layer.length > 0 )
    .map( layer => {
      const element = document.createElement('div');
      element.classList.add('inherit-parent');
      element.innerHTML = layer.join(' ');
      return element;
    } );

  container.append( ...elements );
  return container;
}

function wrapWordsOfElementContent( element, params ) {
  params = { ...DEFAULT_WRAP_PARAMS, ...params }

  element.childNodes.forEach( node => {
    switch (node.nodeType) {

      case TEXT_NODE:
        node.replaceWith( wrapWords( node.textContent, params ) );
        break;

      case ELEMENT_NODE:
        wrapWordsOfElementContent( node, params );
        break;

      default:
        break;

    }
  } );
}


const DEFAULT_WRAP_LINE_PARAMS = {
  ...DEFAULT_PARAMS,
}

function wrapLinesOfTextNode( node, params ) {

  const {
    span_class_name,
    container_class_names,
  } = params;

  const wrappedText = wrapWords( node.textContent, {
    span_fraction: 1,
  } ).children[0];

  node.replaceWith( wrappedText );

  const grouped_words = wrappedText.children.reduce( ( grouped_words, word_element ) => {
    const current_line = grouped_words.at(-1) || null;
    const previous_word_element = current_line ? current_line.at(-1) : null;
    const do_add_newline = !current_line ||
      previous_word_element && previous_word_element.style.top != word_element.style.top;
    
    if (do_add_newline) grouped_words.push([ word_element ]);
    else current_line.push( word_element );

    return grouped_words;
  }, [] );

  wrappedText.replaceChildren( ...grouped_words.map( ( line, i ) => {
    const line_element = document.createElement('span');

    line_element.innerHTML = line.map( ({ outerHTML }) => outerHTML ).join(' ');
    
    line_element.classList.add('line');
    line_element.classList.add( span_class_name );

    line_element.setAttribute( 'index', i );

    return line_element;
  } ) );

  wrappedText.classList.add( ...container_class_names );

}

function wrapLinesOfElementContent( element, params ) {
  if (!element.isConnected) {
    const msg = `Element must be connected to DOM!`;

    console.error( msg, element );

    throw new Error( msg );
  }

  params = { ...DEFAULT_WRAP_PARAMS, ...params }

  element.childNodes.forEach( node => {
    switch (node.nodeType) {

      case TEXT_NODE:
        wrapLinesOfTextNode( node, params );
        break;

      case ELEMENT_NODE:
        wrapLinesOfElementContent( node, params );
        break;

      default:
        break;

    }
  } );
}

const DEFAULT_WRAP_LETTER_PARAMS = {
  ...DEFAULT_WRAP_PARAMS,
  wrap_spaces: false,
}

function wrapLetter( letter ) {
  return wrapText( letter, 'letter' );
}

function wrapLetters( text, params ) {

  const {
    container,
    container_class_names,
    wrap_spaces,
  } = params;

  container = container || document.createElement('div');
  container.classList.add( ...container_class_names );

  container.innerHTML(
    [ ...text ]
      .map( letter => {
        return wrap_spaces || !isWhitespace( letter ) ?
          wrapLetter( letter ).outerHTML :
          letter;
      } )
      .join('')
  );

  return container;
}

function wrapLettersOfElementContent( element, params ) {
  params = { ...DEFAULT_WRAP_LETTER_PARAMS, ...params }

  element.childNodes.forEach( node => {
    switch (node.nodeType) {

      case TEXT_NODE:
        node.replaceWith( wrapLetters( node, params ) );
        break;

      case ELEMENT_NODE:
        wrapLettersOfElementContent( node, params );
        break;

      default:
        break;

    }
  } );
}

export {
  DEFAULT_PARAMS,
  randomlyBreakUpElementContent, DEFAULT_BREAK_UP_PARAMS,
  wrapWordsOfElementContent, DEFAULT_WRAP_PARAMS,
  wrapLinesOfElementContent, DEFAULT_WRAP_LINE_PARAMS,
  wrapLettersOfElementContent, DEFAULT_WRAP_LETTER_PARAMS,
}