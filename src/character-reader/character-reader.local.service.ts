import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Character } from '../interfaces/character.interface';
import { characterFile } from './character-reader.constant';
import { CharacterReader } from './character-reader.interface';

@Injectable()
export class CharacterReaderLocalService implements CharacterReader {
  async getCharacters(): Promise<Character[]> {
    const chars = await this.readFile();
    return JSON.parse(chars);
  }

  async readFile(): Promise<string> {
    return readFile(join(process.cwd(), characterFile), { encoding: 'utf-8' });
  }
}
