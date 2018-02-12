import { Criteria } from "./criteria.model";
import {UUID} from "angular2-uuid";
import * as _ from 'lodash';

export class Waiter {
   private _id: UUID;
   private _firstName: string;
   private _lastName: string;
   private _criteria: Array<Criteria>;

  constructor(firstName: string, lastName: string, criteria: Array<Criteria>) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._criteria = criteria;
  }

  get id(): UUID {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get criteria(): Array<Criteria> {
    return this._criteria;
  }

  public addCriteria(value: Criteria) {
    this._criteria.push(value);
  }

  public removeCriteria(value: Criteria) : Array<Criteria> {
    return _.remove(this._criteria, {_id: value.id});
  }

  get criteriaPoints() : number {
    let number:number = 0.0;

    _.forEach(this._criteria, (c) => {
      number = +number + +c._points;
    });
    return number;
  }

  public hasCriteria(value: Criteria) : boolean {
    return _.find(this._criteria, {_id: value.id});
  }

}
