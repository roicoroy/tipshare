import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { DbService } from "../services/db.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private db: DbService
             ) {
    platform.ready().then(() => {
      this.db.initializeDb()
        .subscribe(s => this.rootPage = TabsPage,
                    e => console.log('Help ' + JSON.stringify(e.message)));
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
