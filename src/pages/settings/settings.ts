import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CriteriaService} from "../../services/criteria.service";
import {WaiterService} from "../../services/waiter.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DbService} from "../../services/db.service";
import {CriteriaPage} from "../criteria/criteria";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              private criteriaService: CriteriaService,
              private waiterService: WaiterService,
              private formBuilder: FormBuilder,
              private db: DbService) {}

  gotoCriteriaPage() {
    console.log('Pushed');
    this.navCtrl.push(CriteriaPage);
  }

  resetDb() {
    this.db.resetDb().subscribe(ok => console.log(ok), error => console.log(error.message));
  }

}
