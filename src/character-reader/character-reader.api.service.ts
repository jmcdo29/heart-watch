import { HttpService, Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { join } from 'path';
import { iif, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Character, SwapiCharacter, SwapiResponse } from '../interfaces';
import { characterFile } from './character-reader.constant';
import { CharacterReader } from './character-reader.interface';

@Injectable()
export class CharacterReaderApiService implements CharacterReader {
  private characters: SwapiCharacter[] = [];
  constructor(private readonly http: HttpService) {}

  async getCharacters(): Promise<Character[]> {
    console.log('Querying the API for character data...');
    return this.callUrl('https://swapi.dev/api/people')
      .pipe(
        map((data) => {
          return data.map(this.mapPerson);
        }),
        tap(async (data) =>
          promises.writeFile(join(process.cwd(), characterFile), JSON.stringify(data)),
        ),
      )
      .toPromise();
  }

  private callUrl(url: string): Observable<SwapiCharacter[]> {
    return this.http.get<SwapiResponse>(url).pipe(
      map((resp) => resp.data),
      mergeMap((data) => {
        this.characters.push(...data.results);
        return iif(() => data.next !== null, this.callUrl(data.next), of(this.characters));
      }),
    );
  }

  private mapPerson(data: SwapiCharacter): Character {
    return {
      name: data.name,
      hairColor: data.hair_color,
      eyeColor: data.eye_color,
      gender: data.gender,
      height: data.height,
    };
  }
}
