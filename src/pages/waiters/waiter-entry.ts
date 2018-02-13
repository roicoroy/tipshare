import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavParams, ViewController} from "ionic-angular";
import {CriteriaService} from "../../services/criteria.service";
import {ErrorService} from "../../services/error.service";
import {Criteria} from "../../models/criteria.model";
import {Waiter} from "../../models/waiter.model";
import {plainToClass} from "class-transformer";

@Component({
  selector: 'page-waiter-entry',
  templateUrl: 'waiter-entry.html'
})
export class WaiterEntryPage {

    public myForm: FormGroup;
    public editWaiter: Waiter;
    public criteria:Array<Criteria> = [];

    constructor(public view: ViewController,
        private navParams: NavParams,
        private formBuilder: FormBuilder,
        private criteriaService: CriteriaService,
        private errorService: ErrorService) {

      this.getCriteria();

        //Get form ready for new waiter
        this.myForm = this.formBuilder.group({
            firstName: ['', Validators.compose([Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20)])],
            lastName: ['', Validators.compose([Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20) ])]
        });
    }

    public save(myForm, isValid:boolean) {
      if(isValid) {
        this.editWaiter.firstName = myForm.firstName;
        this.editWaiter.lastName = myForm.lastName;
        this.view.dismiss(this.editWaiter);
      }
    }

  private getCriteria() {
    this.criteriaService.get()
      .then(success => {
        if(success) {
          this.criteria = plainToClass(Criteria, success);

          //Look for a waiter passed in through nav params
          this.editWaiter = this.navParams.get('waiter');

          //If a waiter has been passed update the form else create a new waiter
          if(this.editWaiter) {
            this.myForm.setValue({
              firstName: this.editWaiter.firstName,
              lastName: this.editWaiter.lastName});
          } else {
            this.editWaiter = new Waiter('', '', []);
          }
        }
      }).catch(error => {
      this.errorService.handleError(error);
    });
  }


  public toggle(event, criteria: Criteria) {
    if(event.checked) {
      this.editWaiter.addCriteria(criteria);
    } else {
      this.editWaiter.removeCriteria(criteria);
    }
  }

  public close() {
      this.view.dismiss();
  }
}
