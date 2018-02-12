import { Component } from '@angular/core';

import { SettingsPage } from "../settings/settings";
import { SharingPage } from "../sharing/sharing";
import { TipsPage } from "../tips/tips";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  settingsTab = SettingsPage;
  tipsTab = TipsPage;
  sharingTab = SharingPage;

  constructor() {}


}
