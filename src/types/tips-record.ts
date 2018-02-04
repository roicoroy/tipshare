import {Moment} from "moment";

export interface TipsRecord {
  cycleDate: Moment;
  archived: boolean,
  waiterLog?: Array<{logDate: Moment,  log: Array<{ waiterId: number, points: number, hours: number, tips: number }>}>;
}
