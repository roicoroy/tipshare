import { Criteria } from "./criteria";

export class Waiter {
   firstName: string;
   lastName: string;
   criteria: Array<Criteria>;

  constructor(firstName: string, lastName: string, criteria?: Array<Criteria>) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.criteria = criteria;
  }
}
