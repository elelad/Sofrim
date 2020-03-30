import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NotificationsService } from '../../services/notifications.service';
import { SettingsService } from '../../services/settings.service';
import { Themes, FontSizeOptions, NosachOptions } from '../../constants/enums';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  themeOptions = Themes;
  fontSizeOptions = FontSizeOptions;
  nosachOptions = NosachOptions;


  constructor(
    public settingsService: SettingsService, public notificationsService: NotificationsService,
    public plt: Platform) { }

  ngOnInit() {
    this.notificationsService.getComingNotification();
  }

  setNosach() {
    this.settingsService.setNosach();
    this.notificationsService.checkPermissionAndSetAll(true);
  }

  setNotification() {
    this.settingsService.setAlowNotification();
    if (this.settingsService.allowNotification) {
      this.notificationsService.checkPermissionAndSetAll(true);
    } else {
      this.notificationsService.removeAll();
    }
  }

  setPreventShabatNotification() {
    this.settingsService.setPreventShabatNotification();
    this.notificationsService.checkPermissionAndSetAll(true);
  }

  setNotificationTime() {
    this.settingsService.setNotificationTime();
    this.notificationsService.checkPermissionAndSetAll(true);
  }

  setShowBadge() {
    this.settingsService.setShowBadge();
    this.notificationsService.checkPermissionAndSetAll(true);
  }

  setLongSound() {
    this.settingsService.setLongSound();
    this.notificationsService.checkPermissionAndSetAll(true);
  }

}
