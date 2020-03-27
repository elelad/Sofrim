import { Component, OnInit } from '@angular/core';
import { HebDateService } from '../../services/heb-date.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController, PopoverController } from '@ionic/angular';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-share-menu',
  templateUrl: './share-menu.component.html',
  styleUrls: ['./share-menu.component.scss'],
})
export class ShareMenuComponent implements OnInit {

  subjectMsg = 'צדיק! עומר? כבר ספרת?';
  private url = 'sofrim.co.il';
  private onelink = 'http://onelink.to/sofrim';
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
    // ga('send', 'event', 'share', 'sms');
    this.bldMsg();
  }

  whatsup() {
    // ga('send', 'event', 'share', 'whatsup');
    console.log('whats up');
    this.bldMsg();
  }

  mail() {
    // ga('send', 'event', 'share', 'mail');
    this.bldMsg();
  }


  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url + this.subjectMsg + ' ' + this.hebDate.omer + ' ' + this.newUrlMsg);
  }

  copy() {
    this.close();
    // ga('send', 'event', 'share', 'copy');
    try {
      // Now that we've selected the anchor text, execute the copy command
      const input = document.createElement('textarea');
      console.log(input);
      input.value = this.subjectMsg + ' ' + this.hebDate.omer + ' ' + this.urlMsg;
      console.log(input.value);
      document.body.appendChild(input);
      input.select();
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copy command was ' + msg);
      document.body.removeChild(input);
      this.toast('הטקסט הועתק ללוח');
    } catch (err) {
      console.log('Oops, unable to copy');
    }
  }
  post() {
    this.close();
    // ga('send', 'event', 'share', 'facebook');
    this.toast('מכין הודעה');
    /*let options: {} = {
      method: 'feed',
      link: this.url,
      name: this.subjectMsg,
      //picture: this.url + '/assets/start.jpg',
      caption: 'סופרים וזוכרים',
      description: this.hebDate.omer
    }*/
    /* let urlPop:string = "https://www.facebook.com/dialog/feed?app_id=652670708251189&display=popup&link=https%3A%2F%2F"
      + this.url
      + "&name=" + this.subjectMsg
      + "&description=" + this.hebDate.omer;
      window.open(urlPop, "pop", "width=600, height=400, scrollbars=no, menubar=no, location=no");// */
    const urlPop: string = 'https://www.facebook.com/dialog/share?app_id=652670708251189&display=popup&href='
      + this.url
      + '&quote=' + this.subjectMsg + ' ' + this.hebDate.omer + ' ' + this.newUrlMsg;
    window.open(urlPop, '_system', 'width=600, height=400, scrollbars=no, menubar=no, location=no'); //
    /*if (this.plt.is('core')) {
      FB.ui(options,
        function (response) {
          if (response && !response.error_message) {
            console.log('Posting completed.');
          } else {
            console.log('Error while posting.');
          }
        });
    } else {
      Facebook.showDialog(options).catch((e)=>console.log(e));
    }*/
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
