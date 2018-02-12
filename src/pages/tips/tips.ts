import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from "moment";
import {Moment} from "moment";
import {WaiterService} from "../../services/waiter.service";
import {TipService} from "../../services/tip.service";
import {TipLog} from "../../models/tiplog.model";

@Component({
  selector: 'page-tips',
  templateUrl: 'tips.html'
})
export class TipsPage {

  public tipLog: TipLog = new TipLog(null, null);
  public cycleDateControl = null;

  constructor(public navCtrl: NavController,
              private tipService: TipService,
              private waiterService: WaiterService) {
  }

  public getCycle(cycleDate) {
    console.log(this.ionicDateToMoment(cycleDate));
  }

  private ionicDateToMoment(date: any) : Moment {
    return moment().year(date.year).month(date.month-1).date(date.day);
  }

  public loadCycle(controlDate: any) {

    let date = this.ionicDateToMoment(controlDate);
    this.tipService.get().then(data => {
      let openLog = _.find(data, {cycleDate: date});
      if (openLog) {
        this.tipLog = openLog;
        this.cycleDateControl = date;
      } else {
        this.waiterService.get()
          .then(waiters => {
            if (waiters) {
              this.tipLog = new TipLog(date, false, waiters);
              this.cycleDateControl = date;
            }
          });
      }
    });
  }

}
