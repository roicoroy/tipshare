import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {DbService} from "./db.service";
import {Waiter} from "../types/waiter";

@Injectable()
export class WaiterService {
  constructor(private db: DbService) {
  }

  public get(firstName?:string) {
    let sql = { query: '', params: []};
    if (name) {
      sql = { query: 'SELECT WaiterID, FirstName, LastName FROM WAITER WHERE FirstName = ?', params: [firstName] };
    } else {
      sql = { query: 'SELECT WaiterID, FirstName, LastName FROM WAITER', params: [] };
    }

    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(sql.query, sql.params)
          .then(data => {
            let waiters:Waiter[] = [];
            if(data.rows.length > 0) {
              for(let i = 0; i < data.rows.length; i++) {
                waiters.push({ firstName: data.rows.item(i).FirstName
                  , lastName: data.rows.item(i).LastName});
              }
            }
            //Return waiters array (populated or empty) to any subscribers
            observer.next(waiters);
            observer.complete();
          }).catch(e => {
            observer.error(new Error(e.message));
            observer.complete();
        });
      }, connErr => {
        observer.error(new Error(`Unable to connect to database ${connErr}`));
        observer.complete();
      });
    });
  }

  public delete(waiter: Waiter) : Observable<Waiter> {
    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(`DELETE FROM WAITER WHERE WaiterID = ?` ,
                  [waiter.waiterId])
          .then(() => {
            observer.next(waiter);
            observer.complete();
          }).catch(error => {
            observer.error(new Error(error.message));
            observer.complete();
          });
      }, connErr => {
        observer.error(new Error(`Unable to connect to database ${connErr}`));
        observer.complete();
      });
    });
  }

  public add(waiter:Waiter) : Observable<Waiter> {
    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(`INSERT INTO WAITER (FirstName, LastName) VALUES (?,?);`,
           [waiter.firstName, waiter.lastName] )
          .then(() => {
            observer.next(waiter);
            observer.complete();
          }).catch(error => {
          observer.error(new Error(error.message));
          observer.complete();
        });
      }, connErr => {
        observer.error(new Error(`Unable to connect to database ${connErr}`));
        observer.complete();
      });
    });
  }

  public update(waiter:Waiter) : Observable<Waiter> {
    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(`UPDATE WAITER
                                  SET FirstName = ?,
                                  LastName = ?,
                                 WHERE WaiterID = ?;`,
          [waiter.firstName, waiter.lastName, waiter.waiterId] )
          .then(() => {
            observer.next({name: waiter.lastName,
              description: waiter.firstName,
              points: waiter.waiterId});
            observer.complete();
          }).catch(error => {
          observer.error(new Error(error.message));
          observer.complete();
        });
      }, connErr => {
        observer.error(new Error(`Unable to connect to database ${connErr}`));
        observer.complete();
      });
    });
  }
}
