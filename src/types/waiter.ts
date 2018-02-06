import { Criteria } from "./criteria";

export interface Waiter {
  firstName: string,
  lastName: string,
  criteria: Array<Criteria>, 
  waiterId?: number
}
