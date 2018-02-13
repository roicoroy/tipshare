import {Component} from "@angular/core";
import {ModalController} from "ionic-angular";
import {ErrorService} from "../../services/error.service";
import {CriteriaService} from "../../services/criteria.service";
import {Criteria} from "../../models/criteria.model";
import {CriteriaEntryPage} from "./criteria-entry";
import * as _ from 'lodash';
import {WaiterService} from "../../services/waiter.service";
import {Waiter} from "../../models/waiter.model";
import {plainToClass} from "class-transformer";

@Component({
  selector: 'page-criteria',
  templateUrl: 'criteria.html'
})
export class CriteriaPage {

  public criteria:Array<Criteria> = [];

  constructor(public modalController: ModalController,
              private criteriaService: CriteriaService,
              private waiterService: WaiterService,
              private errorService: ErrorService) {
    this.getCriteria();
  }

  private getCriteria() {
    this.criteriaService.get()
      .then(data => {
        if(data) {
          this.criteria = plainToClass(Criteria, data);
        }
      }).catch(error => {
      this.errorService.handleError(error);
    });
  }

  public deleteCriteria(criteria: Criteria) {
    _.pull(this.criteria, criteria);
    this.cascadeCriteriaChanges(criteria, true);
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
        _.pull(this.criteria, criteria);
        this.cascadeCriteriaChanges(criteria, false, editedCriteria);
        this.save(editedCriteria);
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

  public cascadeCriteriaChanges(old: Criteria, isDelete: boolean, updated?: Criteria) {
    this.waiterService.get()
      .then(data => {
        let waiters:Array<Waiter> = plainToClass(Waiter, data);

          _.forEach(waiters, (w) => {
            if(isDelete) {
              w.removeCriteria(old);
            } else {
              w.removeCriteria(old);
              w.addCriteria(updated);
            }
          });
       this.waiterService.save(waiters);
      });
  }


}
