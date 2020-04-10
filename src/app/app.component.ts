import { Component } from '@angular/core';
import { Badge } from '@ionic-native/badge/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, NavController, Platform, ToastController } from '@ionic/angular';
import { HebDateService } from './services/heb-date.service';
import { NotificationsService } from './services/notifications.service';
import { CodePush, InstallMode } from '@ionic-native/code-push/ngx';
import { asapScheduler } from 'rxjs';
import { C } from './constants/constants';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages = [
    { title: 'בית', link: '/home', icon: 'home' },
    { title: 'נוסח מלא', link: '/full', icon: 'book' },
    { title: 'הגדרות', link: '/settings', icon: 'options' },
    { title: 'אודות', link: '/about', icon: 'information-circle' },
    { title: 'פרטיות', link: '/privacy', icon: 'person' },
    { title: 'נגישות', link: '/accessibility', icon: 'body' },
  ];

  constructor(
    private plt: Platform,
    private splashScreen: SplashScreen, private navCtrl: NavController,
    private statusBar: StatusBar, private notificationsService: NotificationsService, private menuCtrl: MenuController,
    private badge: Badge, private codePush: CodePush, private hebDateService: HebDateService, private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const msg = await this.hebDateService.getDataForAllYearPromiseNoXhr();
    this.hebDateService.getOmer(new Date(Date.now()).getTime());
    const readySource = await this.plt.ready();
    if (readySource === 'cordova') {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#C62828');
      this.splashScreen.hide();
      this.badge.clear(); // clear badge
      this.notificationsService.initNotifications(msg === 'done');
      this.regidaterListeners();
      setTimeout(() => {
        this.updateFromCodePush(); // update from code push in backgound
      }, 2000);
    }
  }

  regidaterListeners() {

    this.notificationsService.lNotification.on('snooze', (notification: any, eopts) => {// + i
      // console.log(notification);
      this.notificationsService.snoozeAlert(notification.id - 1);
    });

    this.notificationsService.lNotification.on('click', (n, s) => {
      console.log('notification clicked');
      if (n.id >= 700 && n.id < 800) {
        this.navCtrl.navigateRoot(['/remivder']);
      }
      this.badge.clear().then((b) => {
        console.log('badge');
        // console.log(b);
      }).catch((e) => {
        console.log('badge error');
        console.log(e);
      });
    });

    let clicked = 0;
    this.plt.backButton.subscribe(async () => {
      console.log('back btn clicked');
      const menuOpen = await this.menuCtrl.isOpen().catch(err => console.log(err));
      if (menuOpen) {
        this.menuCtrl.close();
      } else {
        // let activePage = this.plt.url.
        const path: string[] = this.plt.url().split('/');
        console.log('path ' + path[path.length - 1]);
        if (path[path.length - 1] !== 'home') {
          this.navCtrl.navigateRoot(['/home']);
        } else {
          clicked++;
          if (clicked === 2) {
            // tslint:disable-next-line: no-string-literal
            navigator['app'].exitApp();
          } else {
            (await this.toastCtrl.create({ message: 'לחץ שנית ליציאה', position: 'top', duration: 2000 })).present();
            asapScheduler.schedule(() => {
              console.log('time ends');
              clicked = 0;
            }, 2000);
          }
        }
      }
    });
    this.plt.resume.subscribe(() => {
      this.badge.clear();
      this.statusBar.overlaysWebView(false);
    });
  }

  updateFromCodePush() {
    if (this.plt.is('cordova')) {
      this.codePush.sync({
        installMode: InstallMode.ON_NEXT_RESUME,
        mandatoryInstallMode: InstallMode.IMMEDIATE,
        minimumBackgroundDuration: 60 * 3
      }).subscribe((syncStatus) => console.log(syncStatus));
    }
  }
}
