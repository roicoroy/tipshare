import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TipService } from '../../services/tip.service';
import { TipLog } from '../../models/tiplog.model';
import * as _ from 'lodash';
import { ErrorService } from '../../services/error.service';
import { Waiter } from '../../models/waiter.model';

@Component({
  selector: 'page-sharing',
  templateUrl: 'sharing.html'
})
export class SharingPage {

  private tipLog: TipLog;
  private weeklyReport;
  private selectedReport;


  constructor(public navCtrl: NavController
      , private tipService: TipService
      , private errorService: ErrorService) {
  }

  private checkForOpenCycle() {
    // Go to storage an retrieve all tiplogs
    this.tipService.get().subscribe(data => {
      // See if there is an open log
      let openLog = _.find(data, {archived: false});
      if (openLog) {
        // Yep = bind to view
        this.tipLog = openLog;
        this.weeklyReport = this.tipLog.weeklyReport();
      }
    }, error => {
      this.errorService.handleError(error);
    });
  }

  public reportSelected(report) {
    if(report == this.selectedReport) {
      //Deselect waiter
      this.selectedReport = null;
    } else {
      this.selectedReport = report;
    }
  }

  public toggleSection(i) {
    this.weeklyReport[i].open = !this.weeklyReport[i].open;
  }
 
  public toggleItem(i, j) {
    this.weeklyReport[i].children[j].open = !this.weeklyReport[i].children[j].open;
  }

  private ionViewDidEnter() {
    this.checkForOpenCycle();
  }

}
