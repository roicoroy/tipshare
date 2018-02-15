import {Component} from "@angular/core";
import {WaiterService} from "../../services/waiter.service";
import {ModalController} from "ionic-angular";
import {WaiterEntryPage} from "./waiter-entry";
import {ErrorService} from "../../services/error.service";
import {Waiter} from "../../models/waiter.model";
import * as _ from 'lodash';

@Component({
  selector: 'page-waiters',
  templateUrl: 'waiters.html'
})
export class WaitersPage {

  public waiters:Array<Waiter> = [];

  constructor(public modalController: ModalController,
              private waiterService: WaiterService,
              private errorService: ErrorService) {
    this.getWaiters();
  }

  private getWaiters() {
    this.waiterService.get().subscribe(data => {
      this.waiters = data;
    }, error => {
      this.errorService.handleError(error);
    });
  }

  public deleteWaiter(waiter: Waiter) {
    _.pull(this.waiters, waiter);
    this.save();
  }

  public addWaiter() {
    let addWaiterModal = this.modalController.create(WaiterEntryPage);

    addWaiterModal.onDidDismiss(waiter => {
      if(waiter) {
        this.save(waiter);
      }
    });
    addWaiterModal.present();
  }

  public editWaiter(waiter: Waiter) {
    let editWaiterModal = this.modalController.create(WaiterEntryPage, { waiter: waiter });

    editWaiterModal.onDidDismiss(editedWaiter => {
      if(editedWaiter) {
        _.pull(this.waiters, waiter);
        this.save(editedWaiter);
      }
    });
    editWaiterModal.present();
  }

  public save(waiter?: Waiter) {
    if(waiter) {
      this.waiters.push(waiter);
    }
    this.waiterService.save(this.waiters);
  }

}
