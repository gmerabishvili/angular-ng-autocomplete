export interface Icountry {
  id: number;
  name: string;
  population: number;
}

export class Country {
  id: number;
  name: string;
  population: number;

  constructor(id: number, name: string, population: number) {
    this.id = id;
    this.name = name;
    this.population = population;
  }
}
