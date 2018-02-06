import {Component} from "@angular/core";
import {ModalController} from "ionic-angular";
import {ErrorService} from "../../services/error.service";
import {CriteriaService} from "../../services/criteria.service";
import {Criteria} from "../../types/criteria";
import {CriteriaEntryPage} from "./criteria-entry";

@Component({
  selector: 'page-criteria',
  templateUrl: 'criteria.html'
})
export class CriteriaPage {

  public criteria:Array<Criteria> = [];

  constructor(public modalController: ModalController,
              private criteriaService: CriteriaService,
              private errorService: ErrorService) {
    this.getWaiters();
  }

  private getWaiters() {
    this.criteriaService.get()
      .then(success => {
        if(success) {
          this.criteria = success;
        }
      }).catch(error => {
      this.errorService.handleError(error);
    });
  }

  public deleteCriteria(criteria: Criteria) {
    const index: number = this.criteria.indexOf(criteria);
    if (index !== -1) {
      this.criteria.splice(index, 1);
    }
    this.save();
  }

  public addCriteria() {
    let addCriteriaModal = this.modalController.create(CriteriaEntryPage);

    addCriteriaModal.onDidDismiss(criteria => {
      if(criteria) {
        this.save(criteria);
      }
    });
    addCriteriaModal.present();
  }

  public editCriteria(criteria: Criteria) {
    let editCriteriaModel = this.modalController.create(CriteriaEntryPage, { criteria: criteria });

    editCriteriaModel.onDidDismiss(editedCriteria => {
      if(editedCriteria) {
        const index: number = this.criteria.indexOf(criteria);
        if (index !== -1) {
          this.criteria.splice(index, 1);
          this.criteria.push(editedCriteria);
        }
        this.save();
      }
    });

    editCriteriaModel.present();
  }

  public save(criteria?: Criteria) {
    if(criteria) {
      this.criteria.push(criteria);
    }
    this.criteriaService.save(this.criteria);
  }
}
