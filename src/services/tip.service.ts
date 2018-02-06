import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {TipsRecord} from "../types/tips-record";
import {Waiter} from "../types/waiter";
import * as moment from 'moment';
import {DbService} from "./db.service";
import * as _ from 'lodash';
import {WaiterService} from "./waiter.service";
import {ErrorService} from "./error.service";
import {Moment} from "moment";

@Injectable()
export class TipService {

  constructor(private db: DbService,
              private waiterService: WaiterService,
              private errorService: ErrorService) {}

  public get(cycleDate: Moment) : Observable<TipsRecord> {
    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(`SELECT CycleDate, 
                                        Archived, 
                                        LogDate, 
                                        WaiterID, 
                                        Hours, 
                                        Tips, 
                                        Points 
                                 FROM TIPS 
                                 WHERE CycleDate = ?;`, [cycleDate.format('YYYY-MM-DD')])
          .then(data => {
              let tipLog: TipsRecord = null;
              if(data.rows.length > 0) {
                tipLog = { cycleDate: moment.utc(data.rows.item(0).CycleDate)
                          , archived: Boolean(data.rows.item(0).Archived)};

                let waiterLog = this._setUpTipWaiterLog(data.rows);
                let logs = this._setUpLogs(data.rows);
                waiterLog = this._mapLogsToDays(waiterLog, logs);
                tipLog.waiterLog = _.orderBy(waiterLog, ['logDate'], ['asc']);
                observer.next(tipLog);
                observer.complete();
              } else {
                this._setUpNewCycle(cycleDate).subscribe(ok => tipLog = ok, error => {
                  observer.error(error);
                  observer.complete();
                });
              }
          }).catch(error => {
          observer.error(error);
          observer.complete();
        });
      }, connErr => {
        observer.error(new Error(`Unable to connect to database ${connErr}`));
        observer.complete();
      });
    });
  }

  public save(tipLog: TipsRecord) : Observable<TipsRecord> {
    console.log(JSON.stringify(tipLog, null, 2));
    return Observable.create(observer => {


      let errors: Array<Error> = [];

      let row = '';
      let cycleDate = tipLog.cycleDate.format('YYYY-MM-DD');
      // console.log(JSON.stringify(tipLog.waiterLog, null, 2));
      // for(let day of tipLog.waiterLog) {
      //   let dayString = day.logDate.format('YYYY-MM-DD');
      //   for(let log of day.log) {
      //     row += `(${log.points},${log.tips},${log.hours},${log.waiterId},${dayString},${day.archived},${cycleDate}),`;
      //   };
      // };
      //
      // let sqlInsert = `INSERT INTO TIPS (Points,Tips,Hours,WaiterID,LogDate,Archived,CycleDate) VALUES ${row};`;
      // console.log(sqlInsert);

      if (errors.length < 1) {
        observer.next(tipLog);
        observer.complete();
      } else {
        observer.error(errors);
        observer.complete();
      }
    });
  }

  private _setUpNewCycle(cycleDate: Moment) : Observable<TipsRecord> {
      //Set up the base of the tip record
      let tipLog: TipsRecord = { cycleDate: cycleDate, archived: false };

        let emptyLogs = [];
        let waiters = this._getWaiterSummaryData();
        _.forEach(waiters, w => {
          emptyLogs.push({ waiterId: w.waiterId, w.points: 0, hours: 0, tips: 0 });
        });

        //For the 6 days following the cycle date add an empty set of logs to the day
        let waiterLog = [{ logDate: tipLog.cycleDate, log: emptyLogs }];
        for(let i = 1; i < 7; i++) {
          waiterLog.push({ logDate:  tipLog.cycleDate.clone().add(i, 'days'),
            log: emptyLogs});
        }
        tipLog.waiterLog = waiterLog;



  }

  private _setUpTipWaiterLog(rows) {

    let waiterLog = [];
    //For every row, create a unique object for each date in the cycle and give it an empty log
    for(let i = 0; i < rows.length; i++) {

      //Only add a new date & log if one does does exist already
      if(_.find(waiterLog, l => {
          return moment(l.logDate).isSame(moment.utc(rows.item(i).LogDate));
        }) == undefined) {
        waiterLog.push({logDate: moment.utc(rows.item(i).LogDate), log: [] });
      }
    }
    return waiterLog;
  }

  private _setUpLogs(rows) {
    let logs = [];
    for(let i = 0; i < rows.length; i++) {

      logs.push({
        logDate: moment.utc(rows.item(i).LogDate),
        log: {
          waiterID: rows.item(i).WaiterID,
          points: rows.item(i).Points,
          hours: rows.item(i).Hours,
          tips: rows.item(i).Tips
        }
      });
    }
    return logs;
  }

  private _mapLogsToDays(waiterLog, logs) {
    _.forEach(logs, l => {
      let match = _.find(waiterLog, w => {
        return moment(w.logDate).isSame(moment(l.logDate));
      });
      match.log.push(l.log);
    });
    return waiterLog;
  }

  private _getWaiterSummaryData() {
    this.waiterService.get().subscribe(waiters => {
      let waiterSummary = [];
      _.forEach(waiters, w => {
        waiterSummary.push({waiterId: w.waiterId, points: this._sumUpWaiterPoints(w)})
      });
    }, error => {
      return error;
    });
  }

  private _sumUpWaiterPoints(waiter: Waiter) : number {
    let total = 0;
    //Todo add them up
    return total;
  }

}
