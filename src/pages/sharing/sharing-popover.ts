import {Component} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";

@Component({
  template: `
    <ion-list>
      <ion-list-header>Sharing Report Actions</ion-list-header>
      <button *ngIf="!show" ion-item icon-left (click)="click('expandAll')"><ion-icon name="arrow-down"></ion-icon>Expand All</button>
      <button *ngIf="!show" ion-item icon-left (click)="click('collapseAll')"><ion-icon name="arrow-forward"></ion-icon>Collapse All</button>
    </ion-list>
  `
})
export class SharingPopover {
  public show:boolean = false;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams) {}

  click(action) {
    console.log(action);
    this.viewCtrl.dismiss({ action });
  }
}