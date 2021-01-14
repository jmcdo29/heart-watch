import axios from 'axios';
import { program } from 'commander';
import { existsSync, promises } from 'fs';
import { join } from 'path';
import { Filters } from './filters.interface';
import { Person } from './person.interface';
import { mapPerson } from './person.mapper';

const charsFile = join(process.cwd(), 'sw_characters.json');
const swapi = 'https://swapi.dev/api/people/';

const { readFile, writeFile } = promises;

program
  .option(
    '-g, --gender <string>',
    'the desired gender to filter on. Should be "male", "female", or "n/a"',
    parseGender,
  )
  .option(
    '-h, --height <height>',
    'Height of the character you wish to cosplay in centimeters',
    parseHeight,
  )
  .option('-e, --eye-color', 'Eye color of the character you wish to cosplay')
  .option('-a, --hair-color', 'Hair color of the character you wish to cosplay')

  .action(async () => {
    let recommendations: Person[] = [];
    let data: Person[] = [];
    if (existsSync(charsFile)) {
      console.log('reading from file');
      data = JSON.parse((await readFile(charsFile)).toString());
    } else {
      console.log('querying api');
      data = await axios.get(swapi).then((res) => res.data.results);
      await writeFile(charsFile, JSON.stringify(data));
    }

    recommendations = makeRecommendation(data, program.opts());
    tabulateData(recommendations);
  });

program.parseAsync();

function parseGender(gender: string): string {
  const genders = ['male', 'female', 'n/a'];
  if (genders.some((goodGenders) => goodGenders === gender)) {
    return gender;
  }
  throw new Error('Gender should be one of "male", "female", or "n/a"');
}

function parseHeight(strHeigh: string): number {
  return Number.parseInt(strHeigh, 10);
}

function makeRecommendation(data: Person[], filters?: Filters): Person[] {
  data = data.map((datum) => mapPerson(datum as any));
  const { gender = '', hairColor = '', height = '', eyeColor = '' } = filters || {};
  if (gender) {
    data = filterOn('gender', data, gender);
  }
  if (hairColor) {
    data = filterOn('hairColor', data, hairColor);
  }
  if (height) {
    data = filterOnHeight(data, height);
  }
  if (eyeColor) {
    data = filterOn('eyeColor', data, eyeColor);
  }
  return data;
}

function tabulateData(recommendations: Person[]): void {
  console.table(recommendations);
}

function filterOnHeight(people: Person[], height: number): Person[] {
  return people.filter((person) => {
    const pHeight = Number.parseInt(person.height);
    return height - 5 <= pHeight && height + 5 >= pHeight;
  });
}

function filterOn(key: keyof Person, people: Person[], value: string): Person[] {
  return people.filter((person) => person[key] === value);
}

/* program
  //   .command('number', { isDefault: true })
  .option('-n, --number <num>', 'Favorite number from 1 to 10', (val: string): number => {
    const num = Number.parseInt(val, 10);
    if (num < 1 || num > 10) {
      throw new Error('Number must be between 1 and 10');
    }
    return num;
  })
  .action((args: Record<string, any>) => {
    const { number: num } = program.opts();
    console.log(`Your favorite number is ${num}`);
  });

program.parse(process.argv); */

// program
// .option('-e, --env1 <filePath>', '.env 1', '.env')
// .option('-s, --env2 <filePath>', '.env 2', '.env.sample');

// program.parse(process.argv);
// console.log(program.env1);
