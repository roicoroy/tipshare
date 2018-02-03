import {Component} from "@angular/core";
import {WaiterService} from "../../services/waiter.service";
import {NavController} from "ionic-angular";
import {CriteriaService} from "../../services/criteria.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DbService} from "../../services/db.service";
import {Criteria} from "../../types/criteria";
import {CriteriaEntryPage} from "./criteria-entry";

@Component({
  selector: 'page-criteria',
  templateUrl: 'criteria.html'
})
export class CriteriaPage {

  private criteria:Array<Criteria> = [];

  constructor(public navCtrl: NavController,
              private criteriaService: CriteriaService) {
  }

  ionViewDidLoad() {
    this._getCriteria();
  }

  ionViewWillEnter() {
    this._getCriteria();
  }

  private _getCriteria() {
    this.criteriaService.get().subscribe(success => {
      this.criteria = success;
    }, error => {
      console.log('error.message');
      //TODO handle error
    });
  }

  public addCriteriaTapped() {
    this.navCtrl.push(CriteriaEntryPage);
  }

  public editCriteriaTapped(criteria: Criteria) {
    this.navCtrl.push(CriteriaEntryPage, { criteria: criteria });
  }
  public deleteCriteriaTapped(criteria: Criteria) {
    this.criteriaService.delete(criteria).subscribe(deleted => {
      this._getCriteria();
    }, error => {
      console.log(error.message);
      //TODO handle error
    });
  }
}
