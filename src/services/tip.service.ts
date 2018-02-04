import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {TipsRecord} from "../types/tips-record";
import {Waiter} from "../types/waiter";
import * as moment from 'moment';
import {DbService} from "./db.service";
import * as _ from 'lodash';

@Injectable()
export class TipService {

  constructor(private db: DbService) {}

  public checkForOpenCycles() : Observable<TipsRecord> {
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
                                 WHERE Archived = 0;`, {})
          .then(data => {
              let tipLog: TipsRecord = null;
              if(data.rows.length > 0) {
                tipLog = { cycleDate: moment.utc(data.rows.item(0).CycleDate)
                          , archived: Boolean(data.rows.item(0).Archived)};

                let waiterLog = this._setUpTipWaiterLog(data.rows);
                let logs = this._setUpLogs(data.rows);
                waiterLog = this._mapLogsToDays(waiterLog, logs);
                tipLog.waiterLog = _.orderBy(waiterLog, ['logDate'], ['asc']);
              }
              observer.next(tipLog);
              observer.complete();

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

}
