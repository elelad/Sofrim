import { Injectable } from '@angular/core';
import { Badge } from '@ionic-native/badge/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { C } from '../constants/constants';
import { SettingsService } from './settings.service';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private delayTime = 0;
  private comingNotification = 0;
  public lNotification: any;
  public badgeSupported = false;

  constructor(
    private settingsService: SettingsService, private toastCtrl: ToastController, private plt: Platform, private badge: Badge,
    private alertCtrl: AlertController) {
  }

  initNotifications(force: boolean = false) {
    this.lNotification = cordova.plugins.notification.local;
    this.initBadge();
    this.checkPermissionAndSetAll(force, false);
    this.setNextYearOfferNotifications();
  }

  initBadge() {
    if (this.plt.is('cordova')) {
      this.badge.hasPermission().then((has) => {
        if (!has) {
          this.badge.requestPermission();
        }
      }).catch((e) => { console.log(e); });
      this.badge.isSupported().then(supported => {
        this.badgeSupported = supported;
      });
    }
  }

  checkIfLaunchFromNotification() {
    const launchDetails = this.lNotification.launchDetails;
    if (launchDetails) {
      return true;
    } else {
      return false;
    }
  }

  getNewNote() {
    const notification = this.addSound({
      id: 40,
      title: 'new noti',
      trigger: { in: 10, unit: 'second' },
      actions: this.getActions(),
      launch: false,
      foreground: true,
      priority: 2,
      icon: C.iconUrl,
      smallIcon: C.smallIconUrl,
      badge: (this.settingsService.showBadge) ? 1 : null

    });
    this.lNotification.schedule(notification);

  }

  addSound(noti: any) {
    if (this.settingsService.longSound) {
      if (this.plt.is('ios')) {
        noti.sound = 'file://assets/alarm.mp3';

      } else if (this.plt.is('android')) {
        noti.sound = 'res://alarm.mp3';
      }
    }
    return noti;
  }

  getNote() {
    this.lNotification.schedule({
      id: 999,
      title: 'סופרים וזוכרים',
      text: 'הודעת ניסיון - הכפתור לא יופיע באפליקציה הסופית',
      at: new Date(Date.now() + 0 * 60000),
      icon: C.iconUrl,
      smallIcon: C.smallIconUrl,
      badge: (this.settingsService.showBadge) ? 1 : null
    });
  }

  checkPermissionAndSetAll(force: boolean = false, toast: boolean = true) {
    if (this.plt.is('cordova')) {
      this.lNotification.hasPermission((has: boolean) => {
        if (has) {
          this.setIfNoNotifications(force, toast);
        } else {
          this.lNotification.requestPermission((granted) => {
            if (this.lNotification.hasPermission) {
              this.setIfNoNotifications(force, toast);
            }
            this.lNotification.hasPermission((hass: boolean) => {
              if (hass) {
                this.setIfNoNotifications(force, toast);
              }
            });
          });
        }
      });
    }
  }

  setIfNoNotifications(force: boolean = false, toast: boolean = true) {
    if (this.plt.is('cordova')) {
      this.lNotification.getAll((allScheduled) => {
        if (allScheduled.length > 0 && !force && allScheduled[0].actions && allScheduled[0].actions.length > 0) {
          this.getComingNotification();
        } else {
          this.setNotificationForAllOmer(toast);
        }
      });
    }
  }

  async snoozeAlert(omerIndex) {
    const msg = C.omerDays[omerIndex].getOmerString(this.settingsService.nosach);
    const notification = {
      id: omerIndex + 1,
      badge: (this.settingsService.showBadge) ? omerIndex + 1 : null,
      title: 'סופרים וזוכרים',
      text: msg
    };
    const alert = await this.alertCtrl.create({
      header: 'הזכר לי בעוד',
      inputs: [
        { type: 'radio', name: '5min', value: '5', label: 'חמש דקות', id: '5min' },
        { type: 'radio', name: '10min', value: '10', label: 'עשר דקות', id: '10min', checked: true },
        { type: 'radio', name: '15min', value: '15', label: 'חמש עשרה דקות', id: '15min' },
        { type: 'radio', name: '30min', value: '30', label: 'שלושים דקות', id: '30min' },
        { type: 'radio', name: '45min', value: '45', label: 'ארבעים וחמש דקות', id: '45min' }
      ],
      buttons: [
        {
          text: 'הפעלה',
          handler: (data) => {
            this.lNotification.schedule(this.addSound({
              id: omerIndex + 1,
              title: notification.title,
              text: notification.text,
              actions: this.getActions(),
              trigger: { in: data, unit: 'minute' }, // second
              badge: (this.settingsService.showBadge) ? notification.badge : null,
              icon: C.iconUrl,
              smallIcon: C.smallIconUrl,
              foreground: true,
              priority: 2
            }));
            setTimeout(async () => {
              const toast = await this.toastCtrl.create({
                message: 'נודניק הוגדר',
                duration: 3000,
                position: 'top',
                cssClass: 'toast'
              });
              toast.present();
            }, 1000);
          }
        },
        {
          text: 'ביטול',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  getActions() {
    return [{ id: 'snooze', title: 'נודניק', launch: true }];
  }

  setNotificationForAllOmer(toast: boolean = true) {
    if (this.lNotification && this.settingsService.allowNotification) {
      this.delayTime = this.settingsService.notificationTime * 60 * 60 * 1000;
      const nowDate = new Date(Date.now());
      const geoYear = nowDate.getFullYear();
      let omerDays: number[];
      if (localStorage.getItem('omer' + geoYear)) { omerDays = JSON.parse(localStorage.getItem('omer' + geoYear)); }
      if (omerDays) {
        omerDays.forEach((day: any, index) => {
          let isShabat = false;
          if (new Date(day).getDay() === 5 && this.settingsService.preventShabatNotification ||
            index === 5 && this.settingsService.preventShabatNotification) {
            isShabat = true;
          }
          if ((day + this.delayTime) > nowDate.getTime() && !isShabat) {// to set notification for this day all evening (6 * 60 * 60000)
            this.lNotification.schedule(this.addSound({
              id: index + 1,
              title: 'סופרים וזוכרים',
              text: C.omerDays[index].getOmerString(this.settingsService.nosach),
              actions: this.getActions(),
              trigger: { at: new Date(day + this.delayTime) },
              foreground: true,
              priority: 2,
              icon: C.iconUrl,
              iconType: 'png',
              smallIcon: C.smallIconUrl,
              badge: (this.settingsService.showBadge) ? index + 1 : null,
            }));
          }
          if (index === 27 && (day + 2.5 * 60 * 60 * 1000) > nowDate.getTime()) {
            this.lNotification.schedule(this.addSound({
              id: 9999,
              title: 'סופרים וזוכרים',
              text: 'יום השנה לפטירתו של רועי',
              foreground: true,
              priority: 2,
              trigger: { at: new Date(day + 2.5 * 60 * 60 * 1000) }, // 20:30
              icon: 'file://favImage.jpg',
              smallIcon: C.smallIconUrl
            }));
          }
        });
      }
      if (toast) {
        this.toast('התראות הוגדרו');
      }
      setTimeout(() => {
        this.getComingNotification();
      }, 800);
    }
  }

  allScheduledAndNewAreSame(old: any[], n: any[]): boolean {
    if (old !== undefined) {
      return n.every((noti) => {
        const oldNoti = old.find((item) => item.id === noti.id); // get the new item that match to the old one
        return (oldNoti !== undefined && oldNoti.badge === noti.badge && oldNoti.title === noti.title
          && oldNoti.text === noti.text && oldNoti.trigger.at === noti.trigger.at); // if item exist but not match then return false
      });
    } else {
      return false;
    }
  }

  removeAll() {
    try {
      this.lNotification.cancelAll((e) => {
        this.toast('התראות בוטלו');
        this.settingsService.comingNotificationMsg.next('אין');
      });
    } catch (e) { console.log(e); }
  }

  getComingNotification() {
    if (this.plt.is('cordova') && this.settingsService.allowNotification) {
      this.comingNotification = 0;
      this.lNotification.getAll((n) => {
        const now = (Math.floor(Date.now() / 1000));
        for (const noti of n) {
          if (this.comingNotification === 0) {
            this.comingNotification = noti.trigger.at;
          } else {
            if ((noti.trigger.at < this.comingNotification && (noti.trigger.at > now))) {
              this.comingNotification = noti.trigger.at;
            }
          }
        }
        const comingDate = new Date(this.comingNotification); // * 1000
        if (this.comingNotification !== 0) {
          const comingString = comingDate.getDate() + '/' +
            (comingDate.getMonth() + 1) + '/' +
            comingDate.getFullYear() + ' ' + comingDate.getHours() + ':00';
          this.settingsService.comingNotificationMsg.next(comingString);

        }
      });
    } else if (this.plt.is('cordova')) {
      this.settingsService.comingNotificationMsg.next('אין');
    }
  }

  async toast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      cssClass: 'toast'
    });
    toast.present();
  }

  setNextYearOfferNotifications() {
    const isSet = (localStorage.getItem(C.localSofrimNextYearReminder));
    if (this.lNotification && !isSet) {
      const nowDate = new Date(Date.now());
      const geoYear = nowDate.getFullYear();
      let omerDays: number[];
      if (localStorage.getItem('omer' + geoYear)) { (omerDays = JSON.parse(localStorage.getItem('omer' + geoYear))); }
      if (omerDays.length > 0) {
        for (let i = 0; i < 2; i++) {
          if (omerDays[45 + i] > Date.now()) {
            const noti = {
              id: 700 + i,
              title: 'סופרים וזוכרים',
              text: 'לתזכר אותך להוריד את היישומון בשנה הבאה?',
              foreground: true,
              priority: 2,
              trigger: { at: new Date(omerDays[45 + i] + 2.5 * 60 * 60 * 1000) }, // 20:30
              icon: C.iconUrl,
              smallIcon: C.smallIconUrl
            };
            this.lNotification.schedule(noti);
          }
        }
      }
    }
  }

  removeNextYearNotifications() {
    if (this.lNotification) {
      this.lNotification.cancel([700, 701, 702, 703, 704, 705]);
    }
  }
}
