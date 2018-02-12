import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ViewController, NavParams} from "ionic-angular";
import {Criteria} from "../../models/criteria.model";

@Component({
  selector: 'page-criteria-entry',
  templateUrl: 'criteria-entry.html'
})
export class CriteriaEntryPage {

  public myForm: FormGroup;
  public editCriteria = null;

  constructor(public view: ViewController,
              private navParams: NavParams,
              private formBuilder: FormBuilder){

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

  public save(myForm, isValid:boolean) {
    if(isValid) {
      let criteria = new Criteria(myForm.name, myForm.description, myForm.points);
      this.view.dismiss(criteria);
    }
  }

  public close() {
    this.view.dismiss();
  }
}
