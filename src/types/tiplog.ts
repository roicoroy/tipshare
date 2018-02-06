import {Moment} from "moment";

export class TipLog {
  private cycleDate: Moment;
  private archived: boolean;
  private waiterLog: Array<{logDate: Moment,
                              log: Array<{ waiterId: number, points: number, hours: number, tips: number }>}>;

  constructor(cycleDate: Moment,
              archived: boolean,
              waiterLog: Array<{ logDate: Moment,
                log: Array<{ waiterId: number; points: number; hours: number; tips: number }> }>) {
    this.cycleDate = cycleDate;
    this.archived = archived;
    this.waiterLog = waiterLog;
  }


}
