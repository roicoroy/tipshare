import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MomentModule } from 'angular2-moment';
import "reflect-metadata";

import { SettingsPage } from '../pages/settings/settings';
import { TipsPage } from "../pages/tips/tips";
import { SharingPage } from "../pages/sharing/sharing";
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {CriteriaService} from "../services/criteria.service";
import {WaiterService} from "../services/waiter.service";
import {CriteriaPage} from "../pages/criteria/criteria";
import {CriteriaEntryPage} from "../pages/criteria/criteria-entry";
import { WaitersPage } from '../pages/waiters/waiters';
import { WaiterEntryPage } from '../pages/waiters/waiter-entry';
import {ErrorService} from "../services/error.service";
import {TipService} from "../services/tip.service";
import {IonicStorageModule} from "@ionic/storage";
import {CycleArchivedPipe} from "../pipes/cycle-archived.pipe";
import {TipdayModal} from "../pages/tips/tipday-modal";
import {TipsPopover} from "../pages/tips/tips-popover";
import {TipArchiveModal} from "../pages/tips/tip-archive-modal";
import { SharingPopover } from '../pages/sharing/sharing-popover';

@NgModule({
  declarations: [
    MyApp,
    SharingPage,
    SharingPopover,
    SettingsPage,
    CriteriaPage,
    CriteriaEntryPage,
    WaitersPage,
    WaiterEntryPage,
    TipsPage,
    TipdayModal,
    TipsPopover,
    TipArchiveModal,
    TabsPage,
    CycleArchivedPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__tipshare',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SharingPage,
    SharingPopover,
    SettingsPage,
    WaitersPage,
    WaiterEntryPage,
    CriteriaPage,
    CriteriaEntryPage,
    TipsPage,
    TipdayModal,
    TipsPopover,
    TipArchiveModal,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WaiterService,
    CriteriaService,
    TipService,
    ErrorService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
