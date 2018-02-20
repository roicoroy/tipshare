import {Moment} from "moment";
import {Waiter} from "./waiter.model";
import * as _ from 'lodash';
import * as moment from 'moment';
import {Transform, Type, plainToClass} from "class-transformer";
import {UUID} from "angular2-uuid";

export class TipLog {
  private _id: UUID;

  @Type(() => Date)
  @Transform(value => value.valueOf(), { toPlainOnly: true })
  @Transform(value => moment(value), { toClassOnly: true })
  private _cycleDate: Moment;

  private _archived: boolean;

  @Type(() => WaiterLog)
  private _waiterLog: WaiterLog[];

  constructor(cycleDate: Moment,
              archived: boolean,
              waiters?: Array<Waiter>) {
    this._id = UUID.UUID();

    if(waiters) {
      this._cycleDate = cycleDate;
      this._archived = archived;

      let waiterLog:Array<WaiterLog> = [new WaiterLog(cycleDate, waiters)];
      for(let i = 1; i < 7; i++) {
        waiterLog.push(new WaiterLog(cycleDate.clone().add(i, 'days'), waiters));
      }
      this._waiterLog = waiterLog;
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


  get waiterLog(): Array<WaiterLog> {
    return this._waiterLog;
  }

  public updateDay(date: Moment, update: WaiterLog) {
    let index = _.findIndex(this._waiterLog, {logDate: date});
    this._waiterLog.splice(index, 1, update);
  }

  public weeklyReport() {
    let waiters: Waiter[] = [];
    _.forEach(this._waiterLog, day => {
      _.forEach(day.log, log => {
          waiters.push(log.waiter);
      });
    });

    let deduped = _.map(
      _.uniq(
        _.map(waiters, function(obj){
          return JSON.stringify(obj);
        })
      ), function(obj) {
        return JSON.parse(obj);
      }
    );
 
    let report = [];
    let typed = plainToClass(Waiter, deduped);
    _.forEach(typed, item => {
      report.push(this.waiterReport(item));
    });
    return report;
  }

  public waiterReport(waiter: Waiter) {
    let report = { waiter: waiter,
      tips: 0,
      hours: 0,
      share: 0,
      log: []
    };
    _.forEach(this._waiterLog, day => {
      let matchedWaiter = _.find(day.log, { waiter: waiter});
      if(matchedWaiter.hours > 0) {
        report.tips += +matchedWaiter.tips;
        report.hours += +matchedWaiter.hours;
        report.share = report.share + +day.getWaiterShare(waiter);
        report.log.push({
          date: day.logDate,
          tips: matchedWaiter.tips,
          hours: matchedWaiter.hours,
          share: day.getWaiterShare(waiter)
        });
      }
    });
    return report;
  }

}

export class WaiterLog {
  @Type(() => Date)
  @Transform(value => value.valueOf(), { toPlainOnly: true })
  @Transform(value => moment(value), { toClassOnly: true })
  private _logDate: Moment;

  @Type(() => Log)
  private _log: Log[];

  constructor(logDate: Moment, waiters: Array<Waiter>) {
    let emptyLogs = [];
    _.forEach(waiters, w => {
      emptyLogs.push(new Log(w, w.criteriaPoints,10,10));
    });
    this._log = emptyLogs;
    this._logDate = logDate;
  }

  get logDate(): Moment {
    return this._logDate;
  }

  get log(): Array<Log> {
    return this._log;
  }

  get howManyWaiters() : number {
    return this._log.length;
  }

  get getTotalPoints() : number {
    let total = 0;
    _.forEach(this._log, d => {
      if(d.hours > 0) {
        total += +d.points;
      }
    });
    return total;
  }

  get getTotalTips() : number {
    let total = 0;
    _.forEach(this._log, d => {
      total += +d.tips;
    });
    return total;
  }
  get getTotalHours() : number {
    let total = 0;
    _.forEach(this._log, d => {
      if(d.hours > 0) {
        total += +d.hours;
      }
    });
    return total;
  }

  get dailyTipRate(): number {
    return this.getTotalTips / (this.getTotalHours + this.getTotalPoints);
  }

  public getWaiterShare(waiter: Waiter) : number {
    let log = _.find(this._log, { _waiter: waiter });
    return this.dailyTipRate * (+log.points + +log.hours);
  }
}

export class Log {
  @Type(() => Waiter)
  private _waiter: Waiter;

  private _points: number;
  private _hours: number;
  private _tips: number;

  constructor(waiter: Waiter, points: number, hours: number, tips: number) {
    this._waiter = waiter;
    this._points = points;
    this._hours = hours;
    this._tips = tips;
  }

  get waiter(): Waiter {
    return this._waiter;
  }

  set waiter(value: Waiter) {
    this._waiter = value;
  }

  get points(): number {
    return this._points;
  }

  set points(value: number) {
    this._points = value;
  }

  get hours(): number {
    return this._hours;
  }

  set hours(value: number) {
    this._hours = value;
  }

  get tips(): number {
    return this._tips;
  }

  set tips(value: number) {
    this._tips = value;
  }
}
