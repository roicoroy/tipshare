import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SettingsPage } from '../pages/settings/settings';
import { TipsPage } from "../pages/tips/tips";
import { SharingPage } from "../pages/sharing/sharing";
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from "@ionic-native/sqlite";
import {DbService} from "../services/db.service";
import {CriteriaService} from "../services/criteria.service";
import {WaiterService} from "../services/waiter.service";
import {CriteriaPage} from "../pages/criteria/criteria";
import {CriteriaEntryPage} from "../pages/criteria/criteria-entry";
import { WaitersPage } from '../pages/waiters/waiters';
import { WaiterEntryPage } from '../pages/waiters/waiter-entry';

@NgModule({
  declarations: [
    MyApp,
    TipsPage,
    SharingPage,
    SettingsPage,
    CriteriaPage,
    CriteriaEntryPage,
    WaitersPage,
    WaiterEntryPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TipsPage,
    SharingPage,
    SettingsPage,
    CriteriaPage,
    CriteriaEntryPage,
    WaitersPage,
    WaiterEntryPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    DbService,
    CriteriaService,
    WaiterService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
