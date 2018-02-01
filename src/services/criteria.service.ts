import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {DbService} from "./db.service";
import {Criteria} from "../types/criteria";

@Injectable()
export class CriteriaService {
  constructor(private db: DbService) {
  }

  public get(criteriaId?:number) : Observable<Criteria[]> {

    //Check optional parameters and build sql object
    let sql = { query: '', params: []};
    if(criteriaId) {
      sql = { query: 'SELECT CriteriaID, Description, Points FROM CRITERIA WHERE CriteriaID = ?', params: [criteriaId] }
    } else {
      sql = { query: 'SELECT CriteriaID, Description, Points FROM CRITERIA', params: [] }
    }

    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(sql.query, sql.params)
          .then(data => {
            let criteria:Criteria[] = [];
            if(data.rows.length > 0) {
              for(let i = 0; i < data.rows.length; i++) {
                criteria.push(new Criteria(data.rows.item(i).CriteriaID
                                          , data.rows.item(i).Name
                                          , data.rows.item(i).Description
                                          , data.rows.item(i).Points));
              }
            }
            //Return criteria array (populated or empty) to any subscribers
            observer.next(criteria);
            observer.complete();
          });
      }, connErr => {
        observer.error(new Error(`Unable to connect to database ${connErr}`));
        observer.complete();
      });
    });
  }

  public delete(criteria: Criteria) : Observable<Criteria> {
    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(`DELETE FROM CRITERIA WHERE Description LIKE '?'` ,
                  [criteria.description])
          .then(success => {
            observer.next(criteria);
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

  public add(criteria:Criteria) : Observable<Criteria> {
    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(`INSERT INTO CRITERIA (Description, Points) VALUES (?,?);`,
           [criteria.description, criteria.points] )
          .then(success => {
            observer.next(criteria);
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
