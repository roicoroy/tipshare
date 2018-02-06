import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {Criteria} from "../types/criteria";

@Injectable()
export class CriteriaService {
  constructor(private storage: Storage) {
  }

  public get() {
    return this.storage.get('criteria');
  }

  public save(criteria: Array<Criteria>) {
    this.storage.set('criteria', criteria);
  }

}
