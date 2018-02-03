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
  rootPage:any = TabsPage;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private db: DbService
             ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.db.initializeDb()
        .subscribe(s => this.rootPage = TabsPage,
                    e => console.log(JSON.stringify(e.message)));
    });
  }
}
