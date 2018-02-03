import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavController, NavParams} from "ionic-angular";
import {CriteriaService} from "../../services/criteria.service";
import {Criteria} from "../../types/criteria";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'page-criteria-entry',
  templateUrl: 'criteria-entry.html'
})
export class CriteriaEntryPage {

  public myForm: FormGroup;
  public editCriteria = null;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private formBuilder: FormBuilder,
              private errorService: ErrorService,
              private criteriaService: CriteriaService){

    //Get criteria form ready for new criteria
    this.myForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50) ])],
      description: ['', Validators.compose([Validators.required,
          Validators.minLength(20),
        Validators.maxLength(200)])],
      points: [null, Validators.compose([Validators.required,
        Validators.min(0),
        Validators.max(10)])]
    });

    //Check to see if this is an edited existing criteria and if so set form values
    this.editCriteria = this.navParams.get('criteria');
    if(this.editCriteria) {
      this.myForm.setValue({
        name: this.editCriteria.name,
        description: this.editCriteria.description,
        points: this.editCriteria.points
      });
    }
  }

  public save(criteria: Criteria, isValid: boolean) {

    if(isValid) {
      //Check to see this if this is an edited existing criteria
      if(this.editCriteria) {
        criteria.criteriaId = this.editCriteria.criteriaId;
        this.criteriaService.update(criteria).subscribe(() => {
          this.navCtrl.pop();
        }, error => {
          this.errorService.handleError(error);
        });
      } else {
        //No, this is a new critera fso call add service
        this.criteriaService.add(criteria).subscribe(() => {
          this.navCtrl.pop();
        }, error => {
          this.errorService.handleError(error);
        });
      }
    } else {
      this.errorService.handleError(new Error('Please check form values and try again.'));
    }

  }
}
