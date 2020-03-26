import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages = [
    { title: 'בית', link: 'Home', icon: 'home' },
    { title: 'נוסח מלא', link: 'Full', icon: 'book' },
    { title: 'הגדרות', link: 'Setting', icon: 'options' },
    { title: 'אודות', link: 'About', icon: 'information-circle' },
    { title: 'פרטיות', link: 'Privacy', icon: 'person' },
    { title: 'נגישות', link: 'Accessibility', icon: 'body' },
    // { title: 'List'}
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
