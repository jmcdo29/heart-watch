import { Inject, OnModuleInit } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';
import { CharacterReader, CharacterReaderSymbol } from '../character-reader';
import { Character, Filters } from '../interfaces';

@Command({
  name: 'suggest',
  description: "Give me some parameters and I'll suggest a character you can cosplay",
  options: { isDefault: true },
})
export class CharacterSuggestionCommand implements CommandRunner, OnModuleInit {
  private characters: Character[] = [];
  constructor(@Inject(CharacterReaderSymbol) private readonly reader: CharacterReader) {}

  async onModuleInit(): Promise<void> {
    this.characters = await this.reader.getCharacters();
  }

  async run(params: string[], options: Filters): Promise<void> {
    this.makeRecommendation(options);
    this.tabulateData();
  }

  private makeRecommendation(options: Filters): void {
    const keys = Object.keys(options) as Array<keyof Filters>;
    keys.forEach((key) => {
      if (options[key]) {
        if (key !== 'height') {
          this.filterOn(key, options[key]!);
        } else {
          this.filterOnHeight(options[key]!);
        }
      }
    });
  }

  private tabulateData(): void {
    console.table(this.characters);
  }

  private filterOn(key: keyof Character, value: string): void {
    this.characters = this.characters.filter((char) => char[key] === value);
  }

  private filterOnHeight(height: number): void {
    this.characters = this.characters.filter((char) => {
      const pHeight = Number.parseInt(char.height);
      return height - 5 <= pHeight && height + 5 >= pHeight;
    });
  }

  @Option({
    flags: '-g, --gender <gender>',
    description: 'The gender of the character you want to cosplay. "male", "female", or "n/a"',
  })
  parseGender(val: string): string {
    const genders: ['male', 'female', 'n/a', 'hermaphrodite'] = [
      'male',
      'female',
      'n/a',
      'hermaphrodite',
    ];
    if (!genders.some((gender) => gender === val)) {
      throw new Error('Invalid gender. Please select "male", "female", or "n/a"');
    }
    return val;
  }

  @Option({
    flags: '-e, --eye-color <color>',
    description: 'The eye color of the character you want to cosplay',
  })
  parseEyeColor(val: string): string {
    return val;
  }

  @Option({
    flags: '-i, --height <height',
    description:
      'The height, in centimeters, of the character you want to cosplay. There is a 5cm variance here',
  })
  parseHeight(val: string): number {
    const height = Number.parseInt(val, 10);
    if (height < 50) {
      throw new Error('The height should be more than 50cm');
    }
    return height;
  }

  @Option({
    flags: '-a, --hair-color <color>',
    description: 'The color of the hair of the character you wish to cosplay',
  })
  parseHairColor(val: string): string {
    return val;
  }
}
