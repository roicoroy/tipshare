import {Component} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NavController} from "ionic-angular";
import {CriteriaService} from "../../services/criteria.service";
import {Criteria} from "../../types/criteria";

@Component({
  selector: 'page-criteria-entry',
  templateUrl: 'criteria-entry.html'
})
export class CriteriaEntryPage {

  private points:number;
  private criteriaFormGroup: FormGroup;

  constructor(private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private criteriaService: CriteriaService){

    //Get criteria form ready
    this.criteriaFormGroup = this.formBuilder.group({
      name: [''],
      description: [''],
      points: ['']
    });
  }

  private addCriteria(criteria: Criteria, ) {
    //Todo - Add criteria service call and success message
    console.log('Criteria added');
  }

  private updateCriteria(criteria: Criteria, ) {
    //Todo - Update criteria service call and success message
    console.log('Criteria updated');
  }
}
