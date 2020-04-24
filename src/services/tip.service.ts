import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {TipLog} from "../models/tiplog.model";
import {classToPlain, plainToClass} from "class-transformer";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TipService {

  constructor(public storage: Storage) {}

  
  public get() : Observable<Array<TipLog>> {
    return Observable.create(observer => {
      this.storage.get('tips')
        .then(data => {
          if(data) {
            observer.next(plainToClass(TipLog, data))
          } else {
            observer.next([]);
          }
          observer.complete();
        }).catch(error => {
        observer.error(error);
        observer.complete();
      });
    });
  }

  public save(tipLog: Array<TipLog>) {
    this.storage.set('tips', classToPlain(tipLog));
  }

}
