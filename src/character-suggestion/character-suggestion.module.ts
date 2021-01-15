import { Module } from '@nestjs/common';
import { characterFile, CharacterReaderModule } from '../character-reader';
import { CharacterSuggestionCommand } from './character-suggestion.command';

@Module({
  imports: [CharacterReaderModule.register(characterFile)],
  providers: [CharacterSuggestionCommand],
  exports: [CharacterSuggestionCommand],
})
export class CharacterSuggestionModule {}
