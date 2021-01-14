import { Person } from 'person.interface';

export function mapPerson(data: Record<string, string>): Person {
  return {
    name: data.name,
    hairColor: data.hair_color,
    eyeColor: data.eye_color,
    gender: data.gender,
    height: data.height,
  }
}