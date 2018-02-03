import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {DbService} from "./db.service";
import {Criteria} from "../types/criteria";

@Injectable()
export class CriteriaService {

  constructor(private db: DbService) {}

  public get(criteriaId?:number) : Observable<Array<Criteria>> {

    //Check optional parameters and build sql object
    let sql = { query: '', params: []};
    if(criteriaId) {
      sql = { query: 'SELECT Name, Description, Points, CriteriaID FROM CRITERIA WHERE CriteriaID = ?', params: [criteriaId] }
    } else {
      sql = { query: 'SELECT Name, Description, Points, CriteriaID FROM CRITERIA', params: [] }
    }

    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(sql.query, sql.params)
          .then(data => {
            let criteria:Array<Criteria> = [];
            if(data.rows.length > 0) {
              for(let i = 0; i < data.rows.length; i++) {
                criteria.push({ name : data.rows.item(i).Name
                                , description: data.rows.item(i).Description
                                , points: data.rows.item(i).Points
                                , criteriaId: data.rows.item(i).CriteriaID });
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
        cn.executeSql(`DELETE FROM CRITERIA WHERE CriteriaID = ?` ,
                  [criteria.criteriaId])
          .then(() => {
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
        cn.executeSql(`INSERT INTO CRITERIA (Name, Description, Points) VALUES (?,?,?);`,
           [criteria.name, criteria.description, criteria.points] )
          .then(() => {
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

  public update(criteria:Criteria) : Observable<Criteria> {
    return Observable.create(observer => {
      this.db.connectDb().subscribe(cn => {
        cn.executeSql(`UPDATE CRITERIA
                                  SET Name = ?,
                                  Description = ?,
                                  Points = ?
                                 WHERE CriteriaID = ?;`,
          [criteria.name, criteria.description, criteria.points, criteria.criteriaId] )
          .then(() => {
            observer.next({name: criteria.name,
              description: criteria.description,
              points: criteria.points,
              criteriaId: criteria.criteriaId});
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
