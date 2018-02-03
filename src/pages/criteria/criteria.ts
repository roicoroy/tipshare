import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {CriteriaService} from "../../services/criteria.service";
import {Criteria} from "../../types/criteria";
import {CriteriaEntryPage} from "./criteria-entry";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'page-criteria',
  templateUrl: 'criteria.html'
})
export class CriteriaPage {

  private criteria:Array<Criteria> = [];

  constructor(public navCtrl: NavController,
              private criteriaService: CriteriaService,
              private errorService: ErrorService) {}

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
      this.errorService.handleError(error);
    });
  }

  public addCriteriaTapped() {
    this.navCtrl.push(CriteriaEntryPage);
  }

  public editCriteriaTapped(criteria: Criteria) {
    this.navCtrl.push(CriteriaEntryPage, { criteria: criteria });
  }
  public deleteCriteriaTapped(criteria: Criteria) {
    this.criteriaService.delete(criteria).subscribe(() => {
      this._getCriteria();
    }, error => {
      console.log(error.message);
      this.errorService.handleError(error);
    });
  }
}
