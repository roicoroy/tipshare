import {Injectable} from "@angular/core";
import {SQLite, SQLiteDatabaseConfig, SQLiteObject} from "@ionic-native/sqlite";
import {Observable} from "rxjs/Observable";
import {Platform} from "ionic-angular";

@Injectable()
export class DbService {

  constructor(private sqlite: SQLite,
              private platform: Platform) {}

  public connectDb() : Observable<SQLiteObject> {
    let dbObj:SQLiteDatabaseConfig;

    if (this.platform.is('ios')) {
      dbObj = {name: "tipshare.db", iosDatabaseLocation: 'default'};
    } else if(this.platform.is('android')) {
      dbObj = {name: "tipshare.db", location: 'default'};
    }

    return Observable.create(observer => {
      this.sqlite.create(dbObj)
        .then(connection => {
          observer.next(connection);
          observer.complete();
        })
        .catch(error => {
          observer.error(new Error(`Database connection failed: ${error}`));
          observer.complete();
        });
    });
  }

  public initializeDb() : Observable<string> {
    return Observable.create(observer => {

      //Open connection and wait for ready state
      this.connectDb().subscribe((db) => {
        //TODO - Make one big script in an external file and load here
        let dbSetupSql = [`CREATE TABLE IF NOT EXISTS CRITERIA (
                                        CriteriaID  INTEGER    PRIMARY KEY AUTOINCREMENT
                                                               NOT NULL,
                                        Description TEXT (100) NOT NULL,
                                        Points      INTEGER    NOT NULL );`,
                           `CREATE TABLE IF NOT EXISTS WAITER (
                                        WaiterID  INTEGER   PRIMARY KEY AUTOINCREMENT
                                                            NOT NULL,
                                        FirstName TEXT (50) NOT NULL,
                                        LastName  TEXT (50) NOT NULL
                                    );`];
        //
        db.sqlBatch(dbSetupSql)
          .then(success => {
            //All good
            observer.next('Database successfully initialised');
            observer.complete();
          })
          .catch(dbError => {
            //Connection was ok but initialisation failed
            observer.error(`Could not initialize database`);
            observer.complete();
          });
      },
        // Connection to database failed
        (error) => {
        observer.error(new Error(`No database connection available: ${error}`));
        observer.complete();
      });
    });
  }

}

