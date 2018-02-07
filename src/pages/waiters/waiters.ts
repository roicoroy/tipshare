import {Component} from "@angular/core";
import {WaiterService} from "../../services/waiter.service";
import {ModalController} from "ionic-angular";
import {Waiter} from "../../types/waiter";
import {WaiterEntryPage} from "./waiter-entry";
import {ErrorService} from "../../services/error.service";
import {Criteria} from "../../types/criteria";

@Component({
  selector: 'page-waiters',
  templateUrl: 'waiters.html'
})
export class WaitersPage {

  public waiters:Array<Waiter> = [];
  public criteria: Array<Criteria> = [];

  constructor(public modalController: ModalController,
              private waiterService: WaiterService,
              private errorService: ErrorService) {
    this.getWaiters();
  }

  private getWaiters() {
    this.waiterService.get()
      .then(success => {
        if(success) {
          this.waiters = success;
        }
      }).catch(error => {
      this.errorService.handleError(error);
    });
  }

  public deleteWaiter(waiter: Waiter) {
    const index: number = this.waiters.indexOf(waiter);
    if (index !== -1) {
      this.waiters.splice(index, 1);
    }
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
    let editWaiterModal = this.modalController.create(WaiterEntryPage, { waiter: waiter, criteria: this.criteria  });

    editWaiterModal.onDidDismiss(editedWaiter => {
      if(editedWaiter) {
        const index: number = this.waiters.indexOf(waiter);
        if (index !== -1) {
          this.waiters.splice(index, 1);
          this.waiters.push(editedWaiter);
        }
        this.save();
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
