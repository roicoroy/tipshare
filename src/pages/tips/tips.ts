import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from "moment";
import {Moment} from "moment";
import {WaiterService} from "../../services/waiter.service";
import {TipService} from "../../services/tip.service";
import {TipLog} from "../../models/tiplog.model";
import {plainToClass} from "class-transformer";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'page-tips',
  templateUrl: 'tips.html'
})
export class TipsPage {

  public tipLog: TipLog = null;
  public tipLogData: Array<TipLog> = [];
  public cycleDateControl = null;
  public showArchive = false;

  constructor(public navCtrl: NavController,
              private tipService: TipService,
              private waiterService: WaiterService,
              private errorService: ErrorService ) {
    this.checkForOpenCycle();
  }

  public getCycle(cycleDate) {
    console.log(this.ionicDateToMoment(cycleDate));
  }

  private ionicDateToMoment(date: any) : Moment {
    return moment().year(date.year).month(date.month-1).date(date.day);
  }

  public checkForOpenCycle() {
    // Go to storage an retrieve all tiplogs
    this.tipService.get().then(data => {

      // If there are any logs convert to class instances of objects
      if (data) {
        this.tipLogData = plainToClass(TipLog, data);
      }

      // See if there is an open log
      let openLog = _.find(this.tipLogData, {archived: false});
      if (openLog) {
        // Yep = bind to view
        this.tipLog = openLog;
      }
    });
  }

  public createNewCycle(controlDate: any) {
    if(controlDate) {
      let date = this.ionicDateToMoment(controlDate);

      if(_.find(this.tipLogData, {cycleDateDay: date.startOf('day')})) {
        this.errorService.handleError(new Error('Cycle already open for this date. Check archives.'));
      } else {
        this.waiterService.get()
          .then(waiters => {
            if (waiters) {
              this.tipLog = new TipLog(date, false, waiters);
              this.save(this.tipLog);
            }
          });
      }
    }
  }

  public save(newTipLog?: TipLog) {
    if(newTipLog) {
      this.tipLogData.push(newTipLog);
    }
    this.tipService.save(this.tipLogData);
  }

  public archiveCycle() {
    _.pull(this.tipLogData, this.tipLog);
    this.tipLog.archived = true;
    this.tipLogData.push(this.tipLog);
    this.tipLog = null;
    this.cycleDateControl = null;
    this.save();
  }

  public toggleArchive() {
    this.showArchive = !this.showArchive;
  }
}
