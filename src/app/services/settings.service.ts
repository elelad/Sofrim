// tslint:disable: max-line-length
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Themes } from '../constants/enums';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public nosach = 'as';
  public allowNotification = true;
  public preventShabatNotification = false;
  public notificationTime = 2;
  private defultShareMsg = 'צדיק! עומר? כבר ספרת?';
  public shareMsg: string = this.defultShareMsg;
  private defultFontSizeName = 'sm';
  private defualtFontSize = '62.5%';
  private mediumFontSize = '75%';
  private largeFontSize = '85%';
  public fontSize: string = this.defultFontSizeName;
  public highTheme = false;
  public showAccessibilityBtn = false;
  public showPicAtMale = true;
  public theme = Themes.None;
  public linkToApp = true;
  public showBadge = true;
  public showKavana = false;
  public longSound = false;
  public appId = '1220693649';
  public comingNotificationMsg: BehaviorSubject<string> = new BehaviorSubject('אין');

  constructor(private plt: Platform) {
    localStorage.getItem('sofrimNosach') ? (this.nosach = localStorage.getItem('sofrimNosach')) : this.nosach = 'as';
    // console.log('(localStorage.getItem(sofrimNotification) == true): ' + (localStorage.getItem('sofrimNotification') == 'true'));
    localStorage.getItem('sofrimNotification') ? this.allowNotification = (localStorage.getItem('sofrimNotification') === 'true') : this.allowNotification = true;
    localStorage.getItem('sofrimPreventShabatNotification') ? this.preventShabatNotification = (localStorage.getItem('sofrimPreventShabatNotification') === 'true') : this.preventShabatNotification = true;
    localStorage.getItem('sofrimNotificationTime') ? this.notificationTime = +localStorage.getItem('sofrimNotificationTime') : this.notificationTime = 2;
    localStorage.getItem('sofrimShareMsg') ? this.shareMsg = localStorage.getItem('sofrimShareMsg') : this.shareMsg = this.defultShareMsg;
    localStorage.getItem('sofrimFontSize') ? this.fontSize = localStorage.getItem('sofrimFontSize') : this.fontSize = this.defultFontSizeName;

    localStorage.getItem('sofrimShowAccessibilityBtn') ? this.showAccessibilityBtn = (localStorage.getItem('sofrimShowAccessibilityBtn') === 'true') : this.showAccessibilityBtn = false;
    if (!(localStorage.getItem('sofrimShowAccessibilityBtn')) && (this.plt.is('desktop') || this.plt.is('mobileweb'))) {
      this.showAccessibilityBtn = true;
    }
    localStorage.getItem('sofrimShowPicAtMale') ? this.showPicAtMale = (localStorage.getItem('sofrimShowPicAtMale') === 'true') : this.showPicAtMale = true;

    localStorage.getItem('sofrimLinkToApp') ? this.linkToApp = (localStorage.getItem('sofrimLinkToApp') === 'true') : this.linkToApp = true;
    localStorage.getItem('sofrimShowBadge') ? this.showBadge = (localStorage.getItem('sofrimShowBadge') === 'true') : this.showBadge = true;
    localStorage.getItem('sofrimShowKavana') ? this.showKavana = (localStorage.getItem('sofrimShowKavana') === 'true') : (this.showKavana = false);
    localStorage.getItem('sofrimLongSound') ? this.longSound = (localStorage.getItem('sofrimLongSound') === 'true') : (this.longSound = false);

    if (localStorage.getItem('sofrimTheme')) {
      this.theme = localStorage.getItem('sofrimTheme') as Themes;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      if (prefersDark.matches){
        this.theme = Themes.Dark;
      } else {
        this.theme = Themes.None;
      }
    }
    (localStorage.getItem('sofrimHighTheme')) ? (this.highTheme = (localStorage.getItem('sofrimHighTheme') === 'true')) : (this.highTheme = false);

    this.changeFont();
    this.changeToHighTheme();
    // if (!this.highTheme) {
    //   document.body.className = this.theme;
    // }

    if (this.plt.is('android')) {
      this.appId = 'com.elelad.sofrim';
    }

  }

  setShowPicAtMale() {
    localStorage.setItem('sofrimShowPicAtMale', this.showPicAtMale.toString());
  }

  setShowBadge() {
    localStorage.setItem('sofrimShowBadge', this.showBadge.toString());
  }

  setShowKavana() {
    localStorage.setItem('sofrimShowKavana', this.showKavana.toString());
  }

  setLongSound() {
    localStorage.setItem('sofrimLongSound', this.longSound.toString());
  }

  setShowAccessibilityBtn() {
    localStorage.setItem('sofrimShowAccessibilityBtn', this.showAccessibilityBtn.toString());
  }

  setNosach() {
    console.log(this.nosach);
    localStorage.setItem('sofrimNosach', this.nosach);
  }

    setAlowNotification() {
    console.log(this.allowNotification);
    localStorage.setItem('sofrimNotification', this.allowNotification.toString());
  }

  setPreventShabatNotification() {
    console.log(this.preventShabatNotification);
    localStorage.setItem('sofrimPreventShabatNotification', this.preventShabatNotification.toString());
  }

  setLinkToApp() {
    console.log(this.linkToApp);
    localStorage.setItem('sofrimLinkToApp', this.linkToApp.toString());
  }

  setNotificationTime() {
    console.log(this.notificationTime);
    localStorage.setItem('sofrimNotificationTime', this.notificationTime.toString());
  }

  setShareMsg() {
    console.log('sofrim msg');
    if (this.shareMsg.length === 0) {
      this.shareMsg = this.defultShareMsg;
    }
    localStorage.setItem('sofrimShareMsg', this.shareMsg);
  }

  setFontSize() {
    localStorage.setItem('sofrimFontSize', this.fontSize);
    this.changeFont();
  }

  changeFont() {
    switch (this.fontSize) {
      case 'sm':
        this.fontDefualt();
        break;
      case 'me':
        this.fontMedium();
        break;
      case 'lg':
        this.fontLarge();
        break;
    }
  }

  fontDefualt() {
    console.log('fontMedium');
    document.documentElement.style.fontSize = this.defualtFontSize;
  }

  fontMedium() {
    console.log('fontMedium');
    document.documentElement.style.fontSize = this.mediumFontSize;
  }

  fontLarge() {
    console.log('fontMedium');
    document.documentElement.style.fontSize = this.largeFontSize;
  }

  setHighTheme() {
    localStorage.setItem('sofrimHighTheme', this.highTheme.toString());
    this.changeToHighTheme();
  }

  changeToHighTheme() {
    if (this.highTheme) {
      document.body.className = 'high';
    } else {
      document.body.className = this.theme;
    }
  }

  setTheme() {
    localStorage.setItem('sofrimTheme', this.theme.toString());
    if (!this.highTheme) {
      document.body.className = this.theme;
    }
  }

  androidFourVersion() {
    try {
      // const versions: any = this.plt.versions(); : //TODO: add app version plugin
      // if (versions.android.major == 4) {
      //   console.log(versions.android.major + '.' + versions.android.minor);
      //   return true;
      // } else {
      //   console.log(versions.android.major + '.' + versions.android.minor);
      //   return false;
      // }
    } catch (e) {
      return false;
    }
  }
}
