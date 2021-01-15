export interface SwapiCharacter {
  eye_color: string;
  gender: string;
  height: string;
  hair_color: string;
  name: string;
}

export interface SwapiResponse {
  count: number;
  next: string;
  previous: string;
  results: SwapiCharacter[];
}
