const link = Object.assign( document.createElement('link'), {
  href: "./effects.css",
  type: 'text/css',
  rel: 'stylesheet',
} );
document.head.appendChild( link );


export * from './selection-functions/letter-by-letter-select';
export * from './selection-functions/paragraph-lines-select';
export * from './selection-functions/random-letters-select';
export * from './selection-functions/word-by-word-select';


export * from './coalesce';