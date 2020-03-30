import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LaunchReview } from '@ionic-native/launch-review/ngx';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  appVersion = '1.6.7';

  constructor(private plt: Platform, private appV: AppVersion, private launchReview: LaunchReview, private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.appV.getVersionNumber().then((version) => this.appVersion = version).catch((e) => console.log(e));
  }

  rateUs() {
    this.launchReview.launch(this.settingsService.appId).catch(err => console.log(err));
  }

}
