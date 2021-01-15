import { DynamicModule, HttpModule, Module } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { CharacterReaderApiService } from './character-reader.api.service';
import { CharacterReaderSymbol } from './character-reader.constant';
import { CharacterReaderLocalService } from './character-reader.local.service';

@Module({})
export class CharacterReaderModule {
  static register(fileName: string): DynamicModule {
    let provider;
    const imports = [];
    if (existsSync(join(process.cwd(), fileName))) {
      provider = CharacterReaderLocalService;
    } else {
      provider = CharacterReaderApiService;
      imports.push(HttpModule);
    }
    return {
      module: CharacterReaderModule,
      imports,
      providers: [{ provide: CharacterReaderSymbol, useClass: provider }],
      exports: [CharacterReaderSymbol],
    };
  }
}
