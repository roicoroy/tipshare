export class Criteria {
  private _name: string;
  private _description: string;
  private _points: number;

  constructor(name: string, description: string, points: number) {
    this._name = name;
    this._description = description;
    this._points = points;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get points(): number {
    return this._points;
  }

  set points(value: number) {
    this._points = value;
  }
}
