import { Module } from '@nestjs/common';
import { CharacterSuggestionModule } from './character-suggestion';

@Module({
  imports: [CharacterSuggestionModule],
})
export class AppModule {}
