import {Moment} from "moment";
import {Waiter} from "./waiter.model";
import * as _ from 'lodash';

export class TipLog {
  private cycleDate: Moment;
  private archived: boolean;
  private waiterLog: Array<{logDate: Moment,
                              log: Array<{ waiter: Waiter, points: number, hours: number, tips: number }>}>;

  constructor(cycleDate: Moment,
              archived: boolean,
              waiters?: Array<Waiter>) {

    if(waiters) {
      this.cycleDate = cycleDate;
      this.archived = archived;

      let emptyLogs = [];
      _.forEach(waiters, w => {
        emptyLogs.push({ points: 0, hours: 0, tips: 20, waiter: w });
      });

      let waiterLog = [{ logDate: cycleDate, log: emptyLogs }];
      for(let i = 1; i < 7; i++) {
        waiterLog.push({ logDate:  cycleDate.clone().add(i, 'days'), log: emptyLogs});
      }
      this.waiterLog = waiterLog;
    }
  }

  public getTotalTips(date: Moment) {
    let day = _.find(this.waiterLog, { logDate: date});
    let total = 0;
      _.forEach(day.log, d => {
        total += d.tips;
      });
      return total.toFixed(2);
  }

}
