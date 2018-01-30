import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private sqlite: SQLite) {
    platform.ready().then(() => {
      this.initialiseDb();

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  /**
   *  Creates a new database or opens a database connection.
   *  In turn, creates tables if they do not already exist.
   */
  private initialiseDb() {
    this.sqlite.create({
      name: 'tipshare.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.createTableCriteria(db);
    }).catch(e => console.log(e));
  }

  private createTableCriteria(db: SQLiteObject) {
    let criteriaTableCreateStatement = `CREATE TABLE IF NOT EXISTS CRITERIA (
                                        CriteriaID  INTEGER    PRIMARY KEY AUTOINCREMENT
                                                               NOT NULL,
                                        Description TEXT (100) NOT NULL,
                                        Points      INTEGER    NOT NULL );`;

    db.executeSql(criteriaTableCreateStatement, {})
      .then(res => console.log(res))
      .catch(e => console.log(e));
  }
}
