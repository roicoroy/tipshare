import {Injectable} from "@angular/core";
import {SQLite, SQLiteDatabaseConfig, SQLiteObject} from "@ionic-native/sqlite";
import {Observable} from "rxjs/Observable";
import {Platform} from "ionic-angular";

@Injectable()
export class DbService {

  public db:SQLiteObject = null;

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
      if(this.db) {
        observer.next(this.db);
        observer.complete();
      } else {
        this.sqlite.create(dbObj)
          .then(connection => {
            this.db = connection;
            observer.next(this.db);
            observer.complete();
          })
          .catch(error => {
            observer.error(new Error(`Database connection failed: ${error}`));
            observer.complete();
          });
      }
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
                                        Name TEXT (50) NOT NULL,
                                        Description TEXT (200) NOT NULL,
                                        Points      INTEGER    NOT NULL );`,
                           `CREATE TABLE IF NOT EXISTS WAITER (
                                        WaiterID  INTEGER   PRIMARY KEY AUTOINCREMENT
                                                            NOT NULL,
                                        FirstName TEXT (50) NOT NULL,
                                        LastName  TEXT (50) NOT NULL
                                    );`,
                            `CREATE TABLE IF NOT EXISTS WAITER_CRITERIA (
                                WaiterID   INTEGER REFERENCES WAITER (WaiterID) ON DELETE CASCADE
                                                                                ON UPDATE CASCADE
                                                                                NOT NULL,
                                CriteriaID INTEGER REFERENCES CRITERIA (CriteriaID) ON DELETE CASCADE
                                                                                    ON UPDATE CASCADE
                                                                                    NOT NULL,
                                PRIMARY KEY (
                                    WaiterID,
                                    CriteriaID
                                ));`,
                                  `CREATE TABLE IF NOT EXISTS TIPS (CycleDate DATE,
                                                      Archived  BOOLEAN NOT NULL,
                                                      LogDate   DATE    NOT NULL,
                                                      WaiterID  INTEGER REFERENCES WAITER (WaiterID) ON DELETE RESTRICT
                                                                                                     ON UPDATE NO ACTION
                                                                        NOT NULL,
                                                      Hours     NUMERIC NOT NULL,
                                                      Tips      NUMERIC NOT NULL,
                                                      Points    NUMERIC NOT NULL,
                                                      PRIMARY KEY (
                                                          CycleDate,
                                                          LogDate,
                                                          WaiterID));`, this.waiters, this.tips];
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

  public resetDb () : Observable<String> {
    return Observable.create(observer => {
      this.connectDb().subscribe(cn => {
        cn.sqlBatch([`DROP TABLE IF EXISTS CRITERIA;`,
          `DROP TABLE IF EXISTS WAITER;`,
          `DROP TABLE IF EXISTS WAITER_CRITERIA;`,
          `DROP TABLE IF EXISTS TIPS;`])
          .then(deleted => {
            this.initializeDb().subscribe(ok => {
              observer.next('All tables reset');
              observer.complete();
            }, error => {
              observer.error(error);
              observer.complete();
            });
          }).catch(error => {
            observer.error(new Error(`Could not truncate tables: ${error.message}`));
            observer.complete();
          });
      }, error => {
        observer.error(new Error(`Could not connect to DB: ${error.message}`));
        observer.complete();
      });
    });
  }



  //SAMPLE DATA
  tips = `INSERT INTO TIPS (
                     Points,
                     Tips,
                     Hours,
                     WaiterID,
                     LogDate,
                     Archived,
                     CycleDate
                 )
                 VALUES (
                     5,
                     20,
                     12,
                     4,
                     '2018-04-01',
                     1,
                     '2018-04-01'
                 ),
                 (
                     5,
                     45,
                     6,
                     4,
                     '2018-04-07',
                     1,
                     '2018-04-01'
                 ),
                 (
                     10,
                     20,
                     9,
                     5,
                     '2018-04-07',
                     1,
                     '2018-04-01'
                 ),
                 (
                     5,
                     5,
                     8,
                     4,
                     '2018-04-06',
                     1,
                     '2018-04-01'
                 ),
                 (
                     5,
                     10,
                     10,
                     4,
                     '2018-04-05',
                     1,
                     '2018-04-01'
                 ),
                  (
                     5,
                     10,
                     10,
                     4,
                     '2018-04-03',
                     1,
                     '2018-04-01'
                 );
`

  waiters = `INSERT INTO WAITER (
                       LastName,
                       FirstName,
                       WaiterID
                   )
                   VALUES (
                       'Smith',
                       'Jon',
                       4
                   ),
                   (
                       'Hyland',
                       'Tim',
                       5
                   );`;

}

