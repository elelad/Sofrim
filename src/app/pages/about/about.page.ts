import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LaunchReview } from '@ionic-native/launch-review/ngx';
import { SettingsService } from '../../services/settings.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { C } from '../../constants/constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  appVersion = '1.8.1';

  constructor(
    public plt: Platform, private appV: AppVersion, private launchReview: LaunchReview,
    private settingsService: SettingsService, private socialSharing: SocialSharing) {
  }

  ngOnInit() {
    this.appV.getVersionNumber().then((version) => this.appVersion = version).catch((e) => console.log(e));
  }

  rateUs() {
    this.launchReview.launch(this.settingsService.appId).catch(err => console.log(err));
  }

  mail() {
    this.socialSharing.shareViaEmail('', '', [C.mail]).catch(err => console.log(err));
  }

}
