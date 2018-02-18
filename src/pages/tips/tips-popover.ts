import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";

@Component({
  template: `
    <ion-list>
      <ion-list-header>Cycle Actions</ion-list-header>
      <button *ngIf="!show" ion-item icon-left (click)="click('refreshWaiters')"><ion-icon name="people"></ion-icon>Refresh Waiters</button>
      <button *ngIf="!show" ion-item icon-left (click)="click('refreshPoints')"><ion-icon name="pie"></ion-icon>Refresh Points</button>
      <button *ngIf="!show" ion-item icon-left (click)="click('archive')"><ion-icon name="trash"></ion-icon>Archive</button>
      <button *ngIf="show" ion-item icon-left (click)="click('open')"><ion-icon name="open"></ion-icon>Open Archive</button>
    </ion-list>
  `
})
export class TipsPopover {
  public show:boolean = false;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams) {
    this.show = this.navParams.get('open');
  }

  click(action) {
    this.viewCtrl.dismiss({ action });
  }
}
