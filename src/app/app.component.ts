import { Component } from '@angular/core';
import { Badge } from '@ionic-native/badge/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { HebDateService } from './services/heb-date.service';
import { NotificationsService } from './services/notifications.service';
import { CodePush, InstallMode } from '@ionic-native/code-push/ngx';


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
    private badge: Badge, private codePush: CodePush, private hebDateService: HebDateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.plt.ready().then(() => {
      // Okay, so the plt is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#C62828');
      this.hebDateService.getDataForAllYearPromiseNoXhr().then((msg) => {// set omer date array
        this.hebDateService.getOmer(new Date(Date.now()).getTime()); // update omer based on the array
        if (this.plt.is('cordova')) {
          console.log('is cordova');
          this.badge.clear(); // clear badge
          this.notificationsService.initNotifications(msg === 'done'); // set notifications for the omer
        }
      }).catch((e) => {
        // alertuser
        console.log(e);
      });
      setTimeout(() => {
        this.updateFromCodePush(); // update from code push in backgound
      }, 2000);
      this.plt.backButton.subscribe(() => {
        console.log('back btn clicked');
        if (this.menuCtrl.isOpen()) {
          console.log('menu open');
          this.menuCtrl.close();
        } else {
          console.log('menu close');
          // let activePage = this.plt.url.
          const path: string[] = this.plt.url().split('/');
          console.log('path ' + path[path.length - 1]);
          if (path[path.length - 1] !== 'home') {
            this.navCtrl.navigateRoot(['/home']);
          } else {
            // tslint:disable-next-line: no-string-literal
            navigator['app'].exitApp();
          }
        }
      });
      this.plt.resume.subscribe(() => {
        this.badge.clear();
        this.statusBar.overlaysWebView(false);
      });
      // this.
      // if (this.plt.is('ios')) {
      //   let timer: any;
      //   window.addEventListener('keyboardDidShow', () => {
      //     clearTimeout(timer);
      //   });
      //   window.addEventListener('keyboardDidHide', () => {
      //     console.log('keyboard closed');
      //     timer = setTimeout(() => {
      //       this.statusBar.overlaysWebView(true);
      //       setTimeout(() => {
      //         this.statusBar.overlaysWebView(false);
      //       }, 10);
      //     }, 20);
      //   });
      // }
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
