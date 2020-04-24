// tslint:disable: max-line-length
// tslint:disable: prefer-for-of
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LaunchReview } from '@ionic-native/launch-review/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { C } from '../../constants/constants';
import { HebDateService } from '../../services/heb-date.service';
import { NotificationsService } from '../../services/notifications.service';
import { SettingsService } from '../../services/settings.service';
import { asapScheduler } from 'rxjs';

declare var cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  private dateInput = '';
  thisYear = 2020;
  private maxYear = this.thisYear + 5;
  private minYear = this.thisYear - 5;
  @ViewChild('datePicker') datePicker;
  private datePickerEl: any;
  pick = false;
  userMonth = 1;
  userDay = 1;
  months: string[] = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  weekDays: string[] = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  private monthArray: number[] = [];
  week1: number[] = [];
  week2: number[] = [];
  week3: number[] = [];
  week4: number[] = [];
  week5: number[] = [];
  week6: number[] = [];
  showNextYearReminderBtn = false;
  showRemindMeAtBtn = false;
  isIgnoringBatteryOptimizations = true;

  constructor(
    public hebDate: HebDateService, private alertController: AlertController,
    private sanitizer: DomSanitizer, public notificationsService: NotificationsService,
    public plt: Platform, private settingsService: SettingsService,
    private launchReview: LaunchReview, private socialSharing: SocialSharing,
    private toastCtrl: ToastController) {

  }

  ngOnInit() {
    if (this.plt.is('ios') || this.plt.is('android')) {
      this.rateUs();
    } else {
      this.offerDownload();
    }
    this.getToday();
    const now = new Date(Date.now());
    this.thisYear = now.getFullYear();
    this.userMonth = now.getMonth();
    this.userDay = now.getDate();
    this.buildMonthArray();
    if (!localStorage.getItem(C.localSofrimNextYearReminder) && this.hebDate.omerNum > 40) {
      this.showNextYearReminderBtn = true;
    }

    const hours = now.getHours();
    this.showRemindMeAtBtn = (hours >= (this.settingsService.notificationTime + 18));
  }

  ngAfterViewInit() {
    this.datePickerEl = document.getElementById('item');
    this.checkOptimization();
  }

  checkOptimization() {
    this.plt.ready().then(() => {
      if (this.plt.is('cordova') && this.plt.is('android')) {
        cordova.plugins.DozeOptimize.IsIgnoringBatteryOptimizations(async (response) => {
          console.log('IsIgnoringBatteryOptimizations: ' + response);
          if (response === 'false') {
            this.isIgnoringBatteryOptimizations = false;
          } else {
            this.isIgnoringBatteryOptimizations = true;
            // console.log('Application already Ignoring Battery Optimizations');
          }
        }, (error) => {
          this.isIgnoringBatteryOptimizations = true;
          // console.error('IsIgnoringBatteryOptimizations Error ' + error);
        });
      }
    });
  }

  showOptimizationAlert() {
    if (this.plt.is('cordova') && this.plt.is('android')) {
      cordova.plugins.DozeOptimize.IsIgnoringBatteryOptimizations(async (response) => {
        console.log('IsIgnoringBatteryOptimizations: ' + response);
        if (response === 'false') {
          this.isIgnoringBatteryOptimizations = false;
          const alert = await this.alertController.create({
            header: 'בעיה בהגדרת התראות',
            message: 'בכדי לקבל התראות האפליקציה צריכה לקבל אישור לעבודה ברקע. מומלץ ללחוץ אישור בהודעת המערכת הבאה',
            buttons: [
              {
                text: 'הבנתי',
                handler: () => {
                  cordova.plugins.DozeOptimize.RequestOptimizations((response2) => {
                    // console.log(response2);
                    asapScheduler.schedule(() => { this.checkOptimization(); }, 10000);
                  }, (error) => {
                    // console.error('BatteryOptimizations Request Error ' + error);
                  });
                }
              }
            ]
          });
          alert.present();
        } else {
          this.isIgnoringBatteryOptimizations = true;
          const toast = await this.toastCtrl.create({
            message: 'עבודה ברקע הוגדרה',
            duration: 3000,
            position: 'top',
            cssClass: 'toast'
          });
          toast.present();
          this.isIgnoringBatteryOptimizations = true;
          // console.log('Application already Ignoring Battery Optimizations');
        }
      }, (error) => {
        this.isIgnoringBatteryOptimizations = true;
        // console.error('IsIgnoringBatteryOptimizations Error ' + error);
      });
    }
  }

  post() {
    const urlPop = 'https://www.facebook.com/dialog/share?app_id=652670708251189&display=popup&href=https://www.sofrim.co.il&quote= הכן סמארטפונך לעומר! אפליקציית תזכורות לספירת העומר לזכרו של רועי מינץ ז"ל';
    window.open(urlPop, 'pop', 'width=600, height=400, scrollbars=no, menubar=no, location=no'); //
  }

  share() {
    this.socialSharing.shareWithOptions({
      message: C.downloadShareMsg,
      url: C.onelink
    }).catch(err => console.log(err));
  }

  async offerDownload() {
    if (this.plt.is('mobileweb') && this.settingsService.linkToApp) {
      const alert = await this.alertController.create({
        header: 'כמה פעמים כמעט שכחת ספירת העומר?',
        message: 'תזכורות לספירת העומר ניתן לקבל באפליקציה המלאה<br><br> <strong><h2>הורד עכשיו!</h2></strong>',
        inputs: [{
          type: 'checkbox',
          label: 'אל תראה שוב',
          value: 'false',
          name: 'no'
        }],
        buttons: [
          {
            text: 'הורדה',
            handler: (data) => {
              if (data[0] === 'false') {
                this.settingsService.linkToApp = false;
                this.settingsService.setLinkToApp();
              }
              window.open('http://onelink.to/sofrim', 'Sofrim');

            }
          },
          {
            text: 'לא כרגע',
            role: 'cancel',
            handler: (data) => {
              this.settingsService.linkToApp = false;
              if (data[0] === 'false') {
                this.settingsService.setLinkToApp();
              }
            }
          },
        ]
      });
      alert.present();
    }

  }

  yearUp() {
    this.thisYear++;
    this.userDay = 1;
    this.buildMonthArray();
  }

  yearDown() {
    this.thisYear--;
    this.buildMonthArray();
  }

  monthUp() {
    if (this.userMonth === 11) {
      this.userMonth = 0;
      this.yearUp();
    } else {
      this.userMonth++;
    }
    this.userDay = 1;
    this.buildMonthArray();
  }

  monthDown() {
    if (this.userMonth === 0) {
      this.userMonth = 11;
      this.yearDown();
    } else {
      this.userMonth--;
    }
    this.userDay = 1;
    this.buildMonthArray();
  }

  buildMonthArray() {
    for (let i = 0; i < 42; i++) {
      this.monthArray[i] = 0;
    }
    const date = new Date(this.thisYear, this.userMonth, 1);
    this.monthArray[date.getDay()] = 1;
    const last = this.getLastDayOfMonth();
    for (let i = 0; i < 42; i++) {
      if (i >= date.getDay() && i < (date.getDay() + last)) {
        if (i === 0) {
          this.monthArray[i] = 1;
        } else {
          this.monthArray[i] = this.monthArray[i - 1] + 1;
        }
      } else {
        this.monthArray[i] = 0;
      }
    }
    this.week1 = this.monthArray.filter((e, i) => (i <= 6));
    this.week2 = this.monthArray.filter((e, i) => (i >= 7 && i < 14));
    this.week3 = this.monthArray.filter((e, i) => (i >= 14 && i < 21));
    this.week4 = this.monthArray.filter((e, i) => (i >= 21 && i < 28));
    this.week5 = this.monthArray.filter((e, i) => (i >= 28 && i < 35));
    this.week6 = this.monthArray.filter((e, i) => (i >= 35));
  }

  getLastDayOfMonth(): number {
    const date = new Date(this.thisYear, this.userMonth + 1, 1);
    const day: number = new Date(date.getTime() - 60000).getDate();
    return day;
  }

  setUserDay(day: number) {
    this.userDay = day;
  }

  datePickerClick() {
    this.datePicker.open();
  }

  getOmerFromDateInput() {
    const values: string[] = this.getDate();
    const date: Date = new Date(+values[0], +values[1] - 1, +values[2]);
    this.hebDate.getOmer(date.getTime());
  }

  getDate() {
    const values: string[] = this.dateInput.split('-');
    return values;
  }

  getHebDate() {
    const date = this.getDate();
    this.hebDate.getHebDate(date[2], date[1], date[0]);
  }

  getToday() {
    const now = new Date(Date.now());
    const month: number = now.getMonth() + 1;
    const day: number = now.getDate();
    const stringMonth: string = (month.toString().length === 1) ? ('0' + month.toString()) : month.toString();
    const stringDay: string = (day.toString().length === 1) ? ('0' + day.toString()) : day.toString();
    this.dateInput = now.getFullYear() + '-' + stringMonth + '-' + stringDay;
    this.hebDate.getOmer(now.getTime());
    this.userDay = day;
    this.userMonth = month - 1;
    this.thisYear = now.getFullYear();
  }

  test() {
    const noon: Date = new Date(1492018700000); // 1492005600000
    this.hebDate.getOmer(noon.getTime());
  }

  setPick() {
    (this.pick) ? this.pick = false : this.pick = true;
    const blur = document.getElementsByClassName('blur');
    for (let i = 0; i < blur.length; i++) {
      if (this.pick) {
        blur[i].setAttribute('tabindex', '-1');
      } else {
        blur[i].setAttribute('tabindex', '0');
      }

    }
  }

  setPickFalse() {
    this.pick = false;
    const blur = document.getElementsByClassName('blur');
    for (let i = 0; i < blur.length; i++) {
      blur[i].setAttribute('tabindex', '0');
    }
  }

  setPickResult() {
    this.setPick();
    const dayString: string = (this.userDay.toString().length === 1) ? ('0' + this.userDay.toString()) : this.userDay.toString();
    const monthString: string = (this.userMonth.toString().length === 1) ? ('0' + (this.userMonth + 1).toString()) : (this.userMonth + 1).toString();
    this.dateInput = this.thisYear + '-' + monthString + '-' + dayString;
    this.getOmerFromDateInput();
  }

  async rateUs() {
    const rateUsAt = +localStorage.getItem(C.storageKeys.sofrimOfferRateUs);
    const now = new Date(Date.now()).getTime();
    if (!rateUsAt) {
      return localStorage.setItem(C.storageKeys.sofrimOfferRateUs, (now + 259200000).toString());
    }
    if (rateUsAt < now && rateUsAt > 0 && this.launchReview.isRatingSupported()) {
      if (this.plt.is('ios') && this.launchReview.isRatingSupported()) {
        this.launchReview.rating().then((status) => {
          if (status === 'dismissed') {
            localStorage.setItem(C.storageKeys.sofrimOfferRateUs, (now + 259200000).toString());
          }
        }).catch(err => console.log(err));
      } else if (this.plt.is('android')) {
        const alert = await this.alertController.create({
          message: 'יש לך דקה לדרג אותנו?',
          buttons: [
            {
              text: 'לא כרגע',
              role: 'cancel',
              handler: () => {
                localStorage.setItem(C.storageKeys.sofrimOfferRateUs, (now + 259200000).toString());
              }
            },
            {
              text: 'בשמחה',
              handler: () => {
                this.launchReview.launch(this.settingsService.appId).catch(err => console.log(err));
                localStorage.setItem(C.storageKeys.sofrimOfferRateUs, (now + 99999999999).toString());
              }
            }
          ]
        });
        alert.present();
      }
    }
  }
}
