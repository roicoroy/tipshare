import {Component} from "@angular/core";
import {WaiterService} from "../../services/waiter.service";
import {NavController} from "ionic-angular";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DbService} from "../../services/db.service";
import {Waiter} from "../../types/waiter";

@Component({
  selector: 'page-waiters',
  templateUrl: 'waiters.html'
})
export class WaitersPage {

    private waiters:Array<Waiter> = [];

    constructor(public navController:NavController, 
        private waiterService: WaiterService) {}

    ionViewDidLoad() {
        this._getWaiters();
        }
    
    ionViewWillEnter() {
    this._getWaiters();
    }

    private _getWaiters() {
        this.waiterService.get().subscribe(success => {
            this.waiters = success;
        }, error => {
            console.log('error.message');
            //TODO handle get waiters error
        });
    }

    public addWaiterTapped() {
        //this.navController.push(WaiterEntryPage);
      }
    
      public editWaiterTapped(waiter: Waiter) {
        //this.navController.push(WaiterEntryPage, { waiter: waiter });
      }
      public deleteWaiterTapped(waiter: Waiter) {
        this.waiterService.delete(waiter).subscribe(deleted => {
          this._getWaiters();
        }, error => {
          console.log(error.message);
          //TODO handle error
        });
      }
}