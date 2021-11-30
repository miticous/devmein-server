export type Genre = 'WOMAN' | 'MAN' | 'ALL';

export interface SearchConfig {
  range: number[];
  genre: Genre;
}
