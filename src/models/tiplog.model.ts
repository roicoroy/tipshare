import {Moment} from "moment";
import {Waiter} from "./waiter.model";
import * as _ from 'lodash';
import * as moment from 'moment';
import {Transform, Type} from "class-transformer";
import {UUID} from "angular2-uuid";

export class TipLog {
  private _id: UUID;

  @Type(() => Date)
  @Transform(value => value.valueOf(), { toPlainOnly: true })
  @Transform(value => moment(value), { toClassOnly: true })
  private _cycleDate: Moment;

  private _archived: boolean;

  @Type(() => WaiterLog)
  private waiterLog: Array<WaiterLog>;

  constructor(cycleDate: Moment,
              archived: boolean,
              waiters?: Array<Waiter>) {
    this._id = UUID.UUID();

    if(waiters) {
      this._cycleDate = cycleDate;
      this._archived = archived;

      let emptyLogs = [];
      _.forEach(waiters, w => {
        emptyLogs.push({ points: w.criteriaPoints, hours: 0, tips: 0, waiter: w });
      });

      let waiterLog:Array<WaiterLog> = [new WaiterLog(cycleDate,emptyLogs)];
      for(let i = 1; i < 7; i++) {
        waiterLog.push(new WaiterLog(cycleDate.clone().add(i, 'days'), emptyLogs));
      }
      this.waiterLog = waiterLog;
    }
  }

  get id(): UUID {
    return this._id;
  }

  get cycleDate(): Moment {
    return this._cycleDate;
  }

  set cycleDate(value: Moment) {
    this._cycleDate = value;
  }

  get archived(): boolean {
    return this._archived;
  }

  set archived(value: boolean) {
    this._archived = value;
  }

  get cycleDateDay() {
    return this._cycleDate.startOf('day');
  }
}

export class WaiterLog {
  @Type(() => Date)
  @Transform(value => value.valueOf(), { toPlainOnly: true })
  @Transform(value => moment(value), { toClassOnly: true })
  private _logDate: Moment;

  private _log: Array<{ waiter: Waiter, points: number, hours: number, tips: number }>;


  constructor(logDate: Moment, log: Array<{ waiter: Waiter; points: number; hours: number; tips: number }>) {
    this._logDate = logDate;
    this._log = log;
  }

  get logDate(): Moment {
    return this._logDate;
  }

  get howManyWaiters() : number {
    return this._log.length;
  }

  get getTotalTips() : number {
    let total = 0;
    _.forEach(this._log, d => {
      total += d.tips;
    });
    return total;
  }



}
