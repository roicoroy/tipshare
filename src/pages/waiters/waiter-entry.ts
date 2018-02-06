import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavController, NavParams} from "ionic-angular";
import {WaiterService} from "../../services/waiter.service";
import { Waiter } from "../../types/waiter";
import { Criteria } from "../../types/criteria";
import { CriteriaService } from "../../services/criteria.service";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'page-waiter-entry',
  templateUrl: 'waiter-entry.html'
})
export class WaiterEntryPage {

    public myForm: FormGroup;
    public editWaiter = null;
    private criteriaOptions: Array<Criteria> = [];
    private tempCriteria: Array<Criteria> = [];

    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private formBuilder: FormBuilder,
        private waiterService: WaiterService,
        private criteriaService: CriteriaService,
        private errorService: ErrorService) {

        //Get form ready for new waiter
        this.myForm = this.formBuilder.group({
            firstName: ['', [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20) ]],
            lastName: ['', [Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20) ]]
        });

        //Check to see if this is editing an existing waiter and if so set form values
        this.editWaiter = this.navParams.get('waiter');
        if(this.editWaiter) {
            this.myForm.setValue({
            firstName: this.editWaiter.firstName,
            lastName: this.editWaiter.lastName});
        }

        this.getCriteria();
    }

    public save(waiter: Waiter) {
        //Check to see if this is editing an existing waiter and if so update
        if(this.editWaiter) {
          waiter.waiterId = this.editWaiter.waiterId;
          this.waiterService.update(waiter).subscribe(() => {
            this.navCtrl.pop();
          }, error => {
            this.errorService.handleError(error);
          });
        } else {
          //If not editing, add a new waiter
          this.waiterService.add(waiter).subscribe(data => {
            if(this.tempCriteria.length > 0) {
              for(let criteria of this.tempCriteria) {
                this.waiterService.addCriteria(criteria, waiter).subscribe(() => {
                  this.navCtrl.pop();
                });
              }
            } else {
              this.navCtrl.pop();
            }
          }, error => {
            this.errorService.handleError(error);
          });
        }
      }

      private getCriteria() {
        this.criteriaService.get().subscribe(success => {
          this.criteriaOptions = success;
        }, error => {
          this.errorService.handleError(error);
        });
      }

      private criteriaToggled(e, criteria: Criteria) {
        if(this.editWaiter) {
          if(e.checked) {
            this.waiterService.addCriteria(criteria, this.editWaiter)
              .subscribe();
          } else {
            this.waiterService.removeCriteria(criteria, this.editWaiter)
              .subscribe();
          }
        } else {
          if(e.checked) {
            this.tempCriteria.push(criteria);
          } else {
            this.tempCriteria.splice(this.tempCriteria.indexOf(criteria), 1);
          }
        }
      }

      private checkCriteria(criteriaOption: Criteria) {
        if(this.editWaiter) {
          for(let criteria of this.editWaiter.criteria) {
            if (criteria.criteriaId == criteriaOption.criteriaId) {
              return true
            }
          }
        }
        return false;
      }

}
