import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CriteriaPage} from "../criteria/criteria";
import {WaitersPage} from '../waiters/waiters';
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController,
              private errorService: ErrorService) {}

  gotoCriteriaPage() {
    this.navCtrl.push(CriteriaPage);
  }

  gotoWaitersPage() {
    this.navCtrl.push(WaitersPage);
  }

  resetDb() {
    //TODO
  }

}
