import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavParams, ViewController} from "ionic-angular";
import {Waiter} from "../../types/waiter";

@Component({
  selector: 'page-waiter-entry',
  templateUrl: 'waiter-entry.html'
})
export class WaiterEntryPage {

    public myForm: FormGroup;
    public editWaiter = null;

    constructor(public view: ViewController,
        private navParams: NavParams,
        private formBuilder: FormBuilder) {

        //Get form ready for new waiter
        this.myForm = this.formBuilder.group({
            firstName: ['', Validators.compose([Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20)])],
            lastName: ['', Validators.compose([Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20) ])]
        });

        //Check to see if this is editing an existing waiter and if so set form values
        this.editWaiter = this.navParams.get('waiter');
        if(this.editWaiter) {
            this.myForm.setValue({
            firstName: this.editWaiter.firstName,
            lastName: this.editWaiter.lastName});
        }
    }

    public save(myForm, isValid:boolean) {
      if(isValid) {
        let waiter = new Waiter(myForm.firstName, myForm.lastName);
        this.view.dismiss(waiter);
      }
    }

}
