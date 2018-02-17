import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";

@Component({
  template: `
    <ion-list>
      <ion-list-header>Cycle Actions</ion-list-header>
      <button ion-item icon-left (click)="click('refreshWaiters')"><ion-icon name="people"></ion-icon>Refresh Waiters</button>
      <button ion-item icon-left (click)="click('refreshPoints')"><ion-icon name="pie"></ion-icon>Refresh Points</button>
      <button ion-item icon-left (click)="click('archive')"><ion-icon name="trash"></ion-icon>Archive</button>
    </ion-list>
  `
})
export class TipsPopover {
  constructor(public viewCtrl: ViewController) {}

  click(action) {
    this.viewCtrl.dismiss({ action });
  }
}
