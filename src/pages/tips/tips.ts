import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import {TipsRecord} from "../../types/tips-record";
import {TipService} from "../../services/tip.service";
import {ErrorService} from "../../services/error.service";
import * as _ from 'lodash';

@Component({
  selector: 'page-tips',
  templateUrl: 'tips.html'
})
export class TipsPage {

  public cycleDateControl = null;

  public tipLog: TipsRecord = { cycleDate: null, archived: false, waiterLog: null };

  constructor(public navCtrl: NavController,
              private tipService: TipService,
              private errorService: ErrorService) {
  }

  ionViewDidEnter() {
    // Check tips table for any rows with a date of today
    this.tipService.checkForOpenCycles().subscribe(result => {
        this.tipLog = result;
        this.cycleDateControl = result.cycleDate.format('YYYY-MM-DD');
    }, error => {
      this.errorService.handleError(error);
    });
    // Load all records in the same cycle
    // Refresh waiters & points
    // Set start cycle start date picker to cycle date from DB
    // Disable date picker input
  }

  cycleStartDateTrigger() {
   // Check for existing started cycle
    // Load all waiters from DB
    // Set cycle start date
    // Iterate through days/waiters setting hours and tips to 0
    // Show UI list
  }

  archiveCycleTapped() {
    // Save current cycle
    // Show are you sure dialog
    // Clear tiplog
    // Reset UI
    // Enable date picker
  }

  public totalDaysTips(day: Array<any>) : string {
    let total = 0;
    _.forEach(day, d => {
      total += d.tips;
    });
    return total.toFixed(2);
  }

}
