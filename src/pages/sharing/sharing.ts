import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TipService } from '../../services/tip.service';
import { TipLog } from '../../models/tiplog.model';
import * as _ from 'lodash';
import { ErrorService } from '../../services/error.service';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { SharingPopover } from './sharing-popover';

@Component({
  selector: 'page-sharing',
  templateUrl: 'sharing.html'
})
export class SharingPage {

  private tipLog: TipLog;
  private weeklyReport;
  private lastSort: {
    field: string,
    asc: boolean
  };

  constructor(public navCtrl: NavController
      , private tipService: TipService
      , private errorService: ErrorService
      , private popoverController: PopoverController) {
    this.lastSort = {field:'', asc: true};
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

  public sortBy(field: string) {
    let direction: string;
    this.lastSort.field = field;
    if(this.lastSort.field == field && this.lastSort.asc) {
      direction = 'desc';
      this.lastSort.asc = false;
    } else {
      direction = 'asc';
      this.lastSort.asc = true;
    }
    this.weeklyReport = _.orderBy(this.weeklyReport, [field], [direction]);
  }

  public presentPopover(myEvent) {
    let popover = this.popoverController.create(SharingPopover);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(resulting => {
      if(resulting) {
        switch(resulting.action) {
          case 'expandAll' : {
            this.expandAll();
            break;
          }
          case 'collapseAll' : {
            this.collapseAll();
            break;
          }
          default : {
            break;
          }
        }
      }
    });
  }

  public toggleSection(i) {
    this.weeklyReport[i].open = !this.weeklyReport[i].open;
  }

  private expandAll() {
    for (let report of this.weeklyReport) {
      report.open = true;
    }
  }

  private collapseAll() {
    for(let report of this.weeklyReport) {
      report.open = false;
    }
  }

  public toggleItem(i, j) {
    this.weeklyReport[i].children[j].open = !this.weeklyReport[i].children[j].open;
  }

  private ionViewDidEnter() {
    this.checkForOpenCycle();
  }

}
