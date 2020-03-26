import { Component, OnInit, Input } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';
import { ShareMenuComponent } from '../share-menu/share-menu.component';
import { AccMenuComponent } from '../acc-menu/acc-menu.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() navTitle = 'סופרים וזוכרים';
  @Input() accBtn = true;
  @Input() shareBtn = true;
  @Input() menuBtn = true;

  constructor(public navCtrl: NavController, public settingsService: SettingsService, private popoverCtrl: PopoverController) { }

  async presentPopover(myEvent) {
    const popover = await this.popoverCtrl.create({
      component: AccMenuComponent,
      event: myEvent
    });
    popover.present();
  }

  async presentShaerPopover(myEvent) {
    const popover = await this.popoverCtrl.create({
      component: ShareMenuComponent,
      event: myEvent
    });
    popover.present();
  }



}

