import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DbService} from "../../services/db.service";
import {CriteriaPage} from "../criteria/criteria";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              private db: DbService) {}

  gotoCriteriaPage() {
    this.navCtrl.push(CriteriaPage);
  }

  resetDb() {
    this.db.resetDb().subscribe(ok => console.log(ok), error => console.log(error.message));
  }

}
