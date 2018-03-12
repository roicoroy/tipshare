import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {WaiterLog} from "../../models/tiplog.model";
import * as _ from 'lodash';

@Component({
  selector: 'page-tipday-modal',
  templateUrl: 'tipday-modal.html'
})
export class TipdayModal {

  day: WaiterLog;
  asTotal: boolean = false;
  total:number = 0;

  constructor(public view: ViewController,
              private navParams: NavParams) {
    this.day = this.navParams.get('log');
  }

  public save() {
    this.view.dismiss(this.day);
  }

  public close() {
    this.view.dismiss();
  }

  public trackByIndex(index: number, value: number) {
    return index;
  }

  public split() {
   this.day.log.forEach(log => {
     log.tips = Math.round((this.total / this.day.howManyWaiters) * 100) / 100;
   });
  }


}
