import {Component} from '@angular/core';
import {ModalController, PopoverController} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from "moment";
import {Moment} from "moment";
import {WaiterService} from "../../services/waiter.service";
import {TipService} from "../../services/tip.service";
import {TipLog} from "../../models/tiplog.model";
import {ErrorService} from "../../services/error.service";
import {TipdayModal} from "./tipday-modal";
import {TipsPopover} from "./tips-popover";
import {TipArchiveModal} from "./tip-archive-modal";

@Component({
  selector: 'page-tips',
  templateUrl: 'tips.html'
})
export class TipsPage {

  public tipLog: TipLog = null;
  public tipLogData: Array<TipLog> = [];
  public cycleDateControl = null;
  public showArchive = false;

  constructor(public modalController: ModalController,
              public popoverController: PopoverController,
              private tipService: TipService,
              private waiterService: WaiterService,
              private errorService: ErrorService ) {
    this.showArchive = true;
    this.checkForOpenCycle();
  }


  private ionicDateToMoment(date: any) : Moment {
    return moment().year(date.year).month(date.month-1).date(date.day);
  }

  public checkForOpenCycle() {
    // Go to storage an retrieve all tiplogs
    this.tipService.get().subscribe(data => {
      this.tipLogData = data;
      // See if there is an open log
      let openLog = _.find(this.tipLogData, {archived: false});
      if (openLog) {
        this.showArchive = false;
        // Yep = bind to view
        this.tipLog = openLog;
      }
    }, error => {
      this.errorService.handleError(error);
    });
  }

  public createNewCycle(controlDate: any) {
    this.showArchive = false;
    if(controlDate) {
      let date = this.ionicDateToMoment(controlDate);
      if(_.find(this.tipLogData, {cycleDateDay: date.startOf('day')})) {
        this.errorService.handleError(new Error('Cycle already open for this date. Check archives.'));
      } else {
        this.waiterService.get().subscribe(data => {
          this.tipLog = new TipLog(date, false, data);
          this.save(this.tipLog);
        }, error => {
          this.errorService.handleError(error);
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
    this.showArchive = true;
    this.save();
  }

  public editDay(day) {

    let editDayModal = this.modalController.create(TipdayModal, { log: day });

    editDayModal.onDidDismiss(editedLog => {
      if(editedLog) {
        this.tipLog.updateDay(day.logDate, editedLog);
        this.save();
      }
    });
    editDayModal.present();
  }

  public presentPopover(myEvent) {
    let popover = this.popoverController.create(TipsPopover, { open: this.showArchive });
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resulting => {
      if(resulting) {
        switch(resulting.action) {
          case 'archive' : {
            this.archiveCycle();
            break;
          }
          case 'open' : {
            this.selectArchive();
            break;
          }
          default : {
            break;
          }
        }
      }
    });
  }

  public selectArchive() {
    let selectArchiveModal = this.modalController.create(TipArchiveModal, { data: this.tipLogData });

    selectArchiveModal.onDidDismiss(tipLog => {
      if(tipLog) {
        tipLog.archived = false;
        this.tipLog = tipLog;
        this.showArchive = false;
        this.save();
      }
    });
    selectArchiveModal.present();
  }
}
