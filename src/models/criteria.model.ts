import {UUID} from "angular2-uuid";

export class Criteria {
  private _name: string;
  private _description: string;
  private _points: number;
  private _id: UUID;

  constructor(name: string, description: string, points: number) {
    this._name = name;
    this._description = description;
    this._points = points;
    this._id = UUID.UUID();
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if(value.length >= 5 && value.length <= 50) {
      this._description = value;
    } else {
      throw new Error('Criteria name must be between 5 and 50 characters long');
    }
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    if(value.length >= 5 && value.length <= 200) {
      this._description = value;
    } else {
      throw new Error('Criteria description must be between 20 and 200 characters long');
    }
  }

  get points(): number {
    return this._points;
  }

  set points(value: number) {
    if(value >= 0.5 && value <= 10) {
      this._points = value;
    } else {
      throw new Error('Points value must be between 0.5 and 10');
    }
  }

  get id(): UUID {
    return this._id;
  }
}
