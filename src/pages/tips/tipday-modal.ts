import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {WaiterLog} from "../../models/tiplog.model";

@Component({
  selector: 'page-tipday-modal',
  templateUrl: 'tipday-modal.html'
})
export class TipdayModal {

  day: WaiterLog;

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

}
