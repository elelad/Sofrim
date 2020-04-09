import { Component, OnInit } from '@angular/core';
import { HebDateService } from '../../services/heb-date.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController, PopoverController } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';
import { C } from '../../constants/constants';

@Component({
  selector: 'app-share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss'],
})
export class ShareMenuComponent implements OnInit {

  subjectMsg = C.defaultShareMsg;
  private url = 'sofrim.co.il';
  private onelink = C.onelink;
  private urlMsg: string = '\n לנוסח המלא: \n' + this.url;
  newUrlMsg: string = '\n להורדה: \n' + this.onelink;



  constructor(
    public popoverCtrl: PopoverController, public hebDate: HebDateService, private sanitizer: DomSanitizer,
    private toastCtrl: ToastController, private settingsService: SettingsService) {
    this.subjectMsg = this.settingsService.shareMsg;
  }

  ngOnInit() { }

  bldMsg() {
    this.close();
    this.toast('מכין הודעה');
  }

  close() {
    this.popoverCtrl.dismiss();
  }

  sms() {
    this.bldMsg();
  }

  whatsup() {
    console.log('whats up');
    this.bldMsg();
  }

  mail() {
    this.bldMsg();
  }


  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url + this.subjectMsg + ' ' + this.hebDate.omer + ' ' + this.newUrlMsg);
  }

  copy() {
    this.close();
    try {
      // Now that we've selected the anchor text, execute the copy command
      const input = document.createElement('textarea');
      input.value = this.subjectMsg + ' ' + this.hebDate.omer + ' ' + this.urlMsg;
      document.body.appendChild(input);
      input.select();
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      document.body.removeChild(input);
      this.toast('הטקסט הועתק ללוח');
    } catch (err) {
      console.log(err);
    }
  }
  post() {
    this.close();
    this.toast('מכין הודעה');
    const urlPop: string = 'https://www.facebook.com/dialog/share?app_id=652670708251189&display=popup&href='
      + this.url
      + '&quote=' + this.subjectMsg + ' ' + this.hebDate.omer + ' ' + this.newUrlMsg;
    window.open(urlPop, '_system', 'width=600, height=400, scrollbars=no, menubar=no, location=no');
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

}
