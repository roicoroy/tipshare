import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {Waiter} from "../models/waiter.model";
import {Observable} from "rxjs/Observable";
import {plainToClass} from "class-transformer";

@Injectable()
export class WaiterService {
  constructor(public storage: Storage) {
  }

  public get() : Observable<Array<Waiter>> {
    return Observable.create(observer => {
      this.storage.get('waiters')
      .then(data => {
        if(data) {
          observer.next(plainToClass(Waiter, data));
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

  public save(waiters: Array<Waiter>) {
    this.storage.set('waiters', waiters);
  }

}
