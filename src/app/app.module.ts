import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Badge } from '@ionic-native/badge/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LaunchReview } from '@ionic-native/launch-review/ngx';
import { CodePush } from '@ionic-native/code-push/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './components/shared/shared.module';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, SharedModule, AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    Badge,
    AppVersion,
    LaunchReview,
    CodePush,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
