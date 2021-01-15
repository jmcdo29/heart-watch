import { Character } from '../interfaces/character.interface';

export interface CharacterReader {
  getCharacters(): Promise<Character[]>;
}
