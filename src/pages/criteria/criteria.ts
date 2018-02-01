import {Component} from "@angular/core";
import {WaiterService} from "../../services/waiter.service";
import {NavController} from "ionic-angular";
import {CriteriaService} from "../../services/criteria.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DbService} from "../../services/db.service";
import {Criteria} from "../../types/criteria";
import {CriteriaEntryPage} from "./criteria-entry";

@Component({
  selector: 'page=criteria',
  templateUrl: 'criteria.html'
})
export class CriteriaPage {

  private criteria:Array<Criteria> = [];

  constructor(public navCtrl: NavController,
              private criteriaService: CriteriaService) {}

  private addCriteria() {
    console.log('Add criteria');
    this.navCtrl.push(CriteriaEntryPage);
  }

  private editCriteria() {
    //TODO - Save edited criteria to the database and update array
    console.log('Edit criteria');
  }

  private getCriteria() {
    //TODO - Get all criteria from the DB and add to array.
    console.log('Get criteria');
  }

  private saveCriteria() {
    //TODO - Save a new criteria to the database and update array.
    console.log('Save criteria');
  }

  private deleteCriteria() {
    //TODO - Remove criteria from the DB and array, are you sure dialog?
    console.log('Delete criteria');
  }
}
