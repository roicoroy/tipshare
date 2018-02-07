import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavParams, ViewController} from "ionic-angular";
import {Waiter} from "../../types/waiter";
import {Criteria} from "../../types/criteria";
import * as _ from 'lodash';
import {CriteriaService} from "../../services/criteria.service";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'page-waiter-entry',
  templateUrl: 'waiter-entry.html'
})
export class WaiterEntryPage {

    public myForm: FormGroup;
    public editWaiter = null;
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
          this.criteria = success;
          //Check to see if this is editing an existing waiter and if so set form values
          this.editWaiter = this.navParams.get('waiter');
          if(this.editWaiter) {
            this.myForm.setValue({
              firstName: this.editWaiter.firstName,
              lastName: this.editWaiter.lastName});
          } else {
            this.editWaiter = new Waiter('', '', []);
          }
          for(let c of this.criteria) {
            let included = _.findIndex(this.editWaiter.criteria, c);
          }
        }
      }).catch(error => {
      this.errorService.handleError(error);
    });
  }


  public toggle(event, criteria: Criteria) {
    if(event.checked) {
      this.editWaiter.criteria.push(criteria);
    } else {
      const index: number = _.findIndex(this.editWaiter.criteria, criteria);
      if (index !== -1) {
        this.editWaiter.criteria.splice(index, 1);
      }
    }
  }

  public isChecked(criteria: Criteria) : boolean {
      let included = _.findIndex(this.editWaiter.criteria, criteria);
      return included > -1;
  }

}
