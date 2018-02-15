import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {Criteria} from "../models/criteria.model";
import {Observable} from "rxjs/Observable";
import {plainToClass} from "class-transformer";

@Injectable()
export class CriteriaService {
  constructor(private storage: Storage) {
  }

  public get() : Observable<Array<Criteria>> {
    return Observable.create(observer => {
      this.storage.get('criteria')
        .then(data => {
          if(data) {
            observer.next(plainToClass(Criteria, data));
          } else {
            observer.next([]);
          }
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
          observer.complete();
      });
    });
  }

  public save(criteria: Array<Criteria>) {
    this.storage.set('criteria', criteria);
  }

}
