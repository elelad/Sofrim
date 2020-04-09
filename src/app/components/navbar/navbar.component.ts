import { Component, OnInit, Input } from '@angular/core';
import { NavController, PopoverController, Platform } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';
import { ShareMenuComponent } from '../share-menu/share-menu.component';
import { AccMenuComponent } from '../acc-menu/acc-menu.component';
import { HebDateService } from '../../services/heb-date.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { C } from '../../constants/constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() navTitle = C.appTitle;
  @Input() accBtn = true;
  @Input() shareBtn = true;
  @Input() menuBtn = true;

  constructor(
    public navCtrl: NavController, public settingsService: SettingsService, private popoverCtrl: PopoverController,
    private plt: Platform, private socialSharing: SocialSharing, public hebDate: HebDateService
  ) { }

  async presentPopover(myEvent) {
    const popover = await this.popoverCtrl.create({
      component: AccMenuComponent,
      event: myEvent
    });
    popover.present();
  }

  async presentShaerPopover(myEvent) {
    if (this.plt.is('cordova')) {
      const msg = C.defaultShareMsg + ' ' + this.hebDate.omer + ' ' + C.toDownload;
      this.socialSharing.shareWithOptions({
        message: msg,
        subject: C.defaultShareMsg,
        url: C.onelink
      }).catch(err => console.log(err));
    } else {
      const popover = await this.popoverCtrl.create({
        component: ShareMenuComponent,
        event: myEvent
      });
      popover.present();
    }
  }



}

