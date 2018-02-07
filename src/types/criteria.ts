export class Criteria {
  name: string;
  description: string;
  points: number;

  constructor(name: string, description: string, points: number) {
    this.name = name;
    this.description = description;
    this.points = points;
  }
}
