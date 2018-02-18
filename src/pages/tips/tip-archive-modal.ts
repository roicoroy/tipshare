import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {TipLog} from "../../models/tiplog.model";

@Component({
  selector: 'page-tip-archive-modal',
  templateUrl: 'tip-archive-modal.html'
})
export class TipArchiveModal {

  data: Array<TipLog>;

  constructor(public view: ViewController,
              private navParams: NavParams) {
    this.data = this.navParams.get('data');
  }

  public unarchive(log: TipLog) {
    this.view.dismiss(log);
  }

  public close() {
    this.view.dismiss();
  }

}
