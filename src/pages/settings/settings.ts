import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {CriteriaService} from "../../services/criteria.service";
import {Criteria} from "../../types/criteria";
import {WaiterService} from "../../services/waiter.service";
import {Waiter} from "../../types/waiter";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public criteria:Criteria[] = [];
  public waiters: Waiter[] = [];
  public error: string[] = [];

  constructor(public navCtrl: NavController
              , private criteriaService: CriteriaService
              , private waiterService: WaiterService) {
          this.criteriaService.get()
            .subscribe((criteria) => this.criteria = criteria, (err) => this.error.push(err));

          this.waiterService.get()
            .subscribe((data) => this.waiters = data, (err) => this.error.push(err));
    }




}
