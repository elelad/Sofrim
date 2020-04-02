import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FontSizeOptions, NosachOptions, Themes } from '../../constants/enums';
import { NotificationsService } from '../../services/notifications.service';
import { SettingsService } from '../../services/settings.service';
import { asap } from 'rxjs/internal/scheduler/asap';
import { asapScheduler, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  themeOptions = Themes;
  fontSizeOptions = FontSizeOptions;
  nosachOptions = NosachOptions;
  destroy: Subject<void> = new Subject<void>();
  comingNotificationMsg = '';


  constructor(
    public settingsService: SettingsService, public notificationsService: NotificationsService,
    public plt: Platform, private ref: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  ngOnInit() {
    this.notificationsService.getComingNotification();
    this.settingsService.comingNotificationMsg.pipe(takeUntil(this.destroy))
      .subscribe(msg => {
        this.comingNotificationMsg = msg;
        asapScheduler.schedule(() => {
          this.ref.detectChanges();
        });
      });
  }

  setNosach() {
    this.settingsService.setNosach();
    this.notificationsService.checkPermissionAndSetAll(true);
  }

  setNotification(event) {
    if (event.detail.checked !== this.settingsService.allowNotification) {
      this.settingsService.allowNotification = event.detail.checked;
      this.settingsService.setAlowNotification();
      if (this.settingsService.allowNotification) {
        this.notificationsService.checkPermissionAndSetAll(true);
      } else {
        this.notificationsService.removeAll();
      }
    }
  }

  setPreventShabatNotification(event) {
    if (event.detail.checked !== this.settingsService.preventShabatNotification) {
      this.settingsService.preventShabatNotification = event.detail.checked;
      this.settingsService.setPreventShabatNotification();
      this.notificationsService.checkPermissionAndSetAll(true);
    }
  }

  setNotificationTime() {
    this.settingsService.setNotificationTime();
    this.notificationsService.checkPermissionAndSetAll(true);
  }

  setShowBadge(event) {
    if (event.detail.checked !== this.settingsService.showBadge) {
      this.settingsService.showBadge = event.detail.checked;
      this.settingsService.setShowBadge();
      this.notificationsService.checkPermissionAndSetAll(true);
    }
  }

  setLongSound(event) {
    if (event.detail.checked !== this.settingsService.longSound) {
      this.settingsService.longSound = event.detail.checked;
      this.settingsService.setLongSound();
      this.notificationsService.checkPermissionAndSetAll(true);
    }
  }

}
