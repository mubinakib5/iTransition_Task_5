declare module 'seedrandom' {
  function seedrandom(seed?: string): () => number;
  export = seedrandom;
}