import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CriteriaPage} from "../criteria/criteria";
import {WaitersPage} from '../waiters/waiters';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController) {}

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
