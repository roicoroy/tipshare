import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavController, NavParams} from "ionic-angular";
import {WaiterService} from "../../services/waiter.service";
import { Waiter } from "../../types/waiter";

@Component({
  selector: 'page-waiter-entry',
  templateUrl: 'waiter-entry.html'
})
export class WaiterEntryPage {

    public myForm: FormGroup;
    public editWaiter = null;

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private formBuilder: FormBuilder,
        private waiterService: WaiterService) {

        //Get criteria form ready for new criteria
        this.myForm = this.formBuilder.group({
            firstName: ['', [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20) ]],
            lastName: ['', [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20) ]]
        });

        //Check to see if this is an edited existing criteria and if so set form values
        this.editWaiter = this.navParams.get('waiter');
        if(this.editWaiter) {
            this.myForm.setValue({
            firstName: this.editWaiter.firstName,
            lastName: this.editWaiter.lastName});
        }
    }

    public save(waiter: Waiter) {

        //Check to see this if this is an edited existing criteria
        if(this.editWaiter) {
          waiter.waiterId = this.editWaiter.waiterId;
          this.waiterService.update(waiter).subscribe(success => {
            this.navCtrl.pop();
            console.info(`Waiter updated: ${JSON.stringify(success)}`);
          }, failure => {
            console.log(failure.message);
            //TODO - handle errors
          });
        } else {
          //No, this is a new critera fso call add service
          this.waiterService.add(waiter).subscribe(success => {
            this.navCtrl.pop();
            console.info(`waiter updated: ${JSON.stringify(success)}`);
          }, failure => {
            console.log(failure.message);
            //TODO - handle error
          });
        }
    
      }

}