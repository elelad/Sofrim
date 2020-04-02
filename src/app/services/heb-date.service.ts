import { Injectable } from '@angular/core';
import { C } from '../constants/constants';
import { SettingsService } from './settings.service';
import { NotificationsService } from './notifications.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HebDateService {
  private startUtl = 'http://www.hebcal.com/converter/?cfg=json'; // !
  private endUrl = '&g2h=1';
  public hebDate = '';
  public omer: string = C.notOmerYetMsg;
  public zohar = '';
  public kavana = '';
  private startGetGeoUrl = 'http://www.hebcal.com/converter/?cfg=json'; // !
  private endGetGeoUrl = '&h2g=1';
  public isOmer = false;
  public omerNum = 0;

  constructor(private settingsService: SettingsService, private notificationsService: NotificationsService, private plt: Platform) {
    if (!this.plt.is('desktop')) {// this.settingService.androidFourVersion() = if mobile
      this.startUtl = this.startUtl.replace('https', 'http');
      this.startGetGeoUrl = this.startGetGeoUrl.replace('https', 'http');
      console.log('https replaced');
    }
    // this.getDataForAllYear();//get data for the first time this year
  }

  getDataForAllYear() {// get data for the first time this year
    const now = new Date(Date.now());
    let year: string = (now.getFullYear() + 3760).toString(); // convert to heb year
    let geoYear: number = now.getFullYear(); // get year
    if (now.getMonth() > 6) { // after 1 in july get next year omer
      year = (now.getFullYear() + 3761).toString(); // go to next year
      geoYear = (now.getFullYear() + 1); // go to next year
    }
    if (!localStorage.getItem('omer' + geoYear)) { // if data for this year not exist
      const day = '16'; // heb day for first omer day
      const month = 'Nisan'; // heb month for first omer day
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open('GET', this.buildGeoUrl(day, month, year), true);
      xhr.onreadystatechange = (data) => {
        console.log('xhr.readyState: ');
        console.log(xhr.readyState);
        console.log('xhr.status: ');
        console.log(xhr.status);
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          console.log(xhr.response);
          const respond = JSON.parse(xhr.response);
          const firstDate = new Date(respond.gy, (respond.gm - 1), respond.gd); // get the georgian date for the first omer date
          console.log(firstDate.toString());
          console.log(firstDate.getDate());
          console.log(new Date(firstDate.valueOf() + firstDate.getTimezoneOffset() * 60000));
          const omerForAllYear: number[] = []; // array for all omer days
          const firstDateEvning: number = firstDate.getTime() - 21600000; // start the day from 18:00 to provide data for the evning
          console.log('firstDateEvning: ');
          console.log(firstDateEvning);
          omerForAllYear.push(firstDateEvning); // push the first day
          for (let i = 1; i < 49; i++) {// loop for 48 more days
            omerForAllYear.push(firstDateEvning + (i * 86400000)); // add the next day
          }
          // console.log(omerForAllYear);
          localStorage.setItem('omer' + geoYear, JSON.stringify(omerForAllYear)); // put data in ocal storage
          // console.log(new Date(omerForAllYear[2]).toString());
          // this.notificationsService.setNotificationForAllOmer();
        }
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
          console.log('xhr no response');
          let firstDateEvning: number;
          switch (geoYear) {
            case 2017:
              firstDateEvning = 1491922800000;
              break;
            case 2018:
              firstDateEvning = 1522508400000;
              break;
            case 2019:
              firstDateEvning = 1555772400000;
              break;
            case 2020:
              firstDateEvning = 1585753200000;
              break;
            case 2021:
              firstDateEvning = 1614614400000;
              break;
          }
          const omerForAllYear: number[] = []; // array for all omer days
          omerForAllYear.push(firstDateEvning); // push the first day
          for (let i = 1; i < 49; i++) {// loop for 48 more days
            omerForAllYear.push(firstDateEvning + (i * 86400000)); // add the next day
          }
          // console.log(omerForAllYear);
          localStorage.setItem('omer' + geoYear, JSON.stringify(omerForAllYear)); // put data in ocal storage
          // console.log(new Date(omerForAllYear[2]).toString());
          // this.notificationsService.setNotificationForAllOmer();
        }
      };
      xhr.send();
    } else {// data for this year allready exist
      console.log('data exist for ' + geoYear);
    }
  }

  getDataForAllYearPromise() {// get data for the first time this year
    return new Promise((res, rej) => {
      const now = new Date(Date.now());
      let year: string = (now.getFullYear() + 3760).toString(); // convert to heb year
      let geoYear: number = now.getFullYear(); // get year
      if (now.getMonth() > 6) { // after 1 in july get next year omer
        year = (now.getFullYear() + 3761).toString(); // go to next year
        geoYear = (now.getFullYear() + 1); // go to next year
      }
      if (!localStorage.getItem('omer' + geoYear)) { // if data for this year not exist
        const day = '16'; // heb day for first omer day
        const month = 'Nisan'; // heb month for first omer day
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open('GET', this.buildGeoUrl(day, month, year), true);
        xhr.onreadystatechange = (data) => {
          console.log('xhr.readyState: ');
          console.log(xhr.readyState);
          console.log('xhr.status: ');
          console.log(xhr.status);
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.response);
            const respond = JSON.parse(xhr.response);
            const firstDate = new Date(respond.gy, (respond.gm - 1), respond.gd); // get the georgian date for the first omer date
            console.log(firstDate.toString());
            console.log(firstDate.getDate());
            console.log(new Date(firstDate.valueOf() + firstDate.getTimezoneOffset() * 60000));
            const omerForAllYear: number[] = []; // array for all omer days
            const firstDateEvning: number = firstDate.getTime() - 21600000; // start the day from 18:00 to provide data for the evning
            console.log('firstDateEvning: ');
            console.log(firstDateEvning);
            omerForAllYear.push(firstDateEvning); // push the first day
            for (let i = 1; i < 49; i++) {// loop for 48 more days
              omerForAllYear.push(firstDateEvning + (i * 86400000)); // add the next day
            }
            // console.log(omerForAllYear);
            localStorage.setItem('omer' + geoYear, JSON.stringify(omerForAllYear)); // put data in ocal storage
            // console.log(new Date(omerForAllYear[2]).toString());
            // this.notificationsService.setNotificationForAllOmer();
            res('done');
          }
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
            console.log('xhr no response');
            let firstDateEvning: number;
            switch (geoYear) {
              case 2017:
                firstDateEvning = 1491922800000;
                break;
              case 2018:
                firstDateEvning = 1522508400000;
                break;
              case 2019:
                firstDateEvning = 1555772400000;
                break;
              case 2020:
                firstDateEvning = 1585753200000;
                break;
              case 2021:
                firstDateEvning = 1614614400000;
                break;
            }
            const omerForAllYear: number[] = []; // array for all omer days
            omerForAllYear.push(firstDateEvning); // push the first day
            for (let i = 1; i < 49; i++) {// loop for 48 more days
              omerForAllYear.push(firstDateEvning + (i * 86400000)); // add the next day
            }
            // console.log(omerForAllYear);
            localStorage.setItem('omer' + geoYear, JSON.stringify(omerForAllYear)); // put data in local storage
            // console.log(new Date(omerForAllYear[2]).toString());
            // this.notificationsService.setNotificationForAllOmer();
            res('done');
          }
        };
        xhr.send();
      } else {// data for this year allready exist
        console.log('data exist for ' + geoYear);
        res('done');
      }
    });
  }

  getDataForAllYearPromiseNoXhr() {// get data for the first time this year
    return new Promise((res, rej) => {
      const now = new Date(Date.now());
      let year: string = (now.getFullYear() + 3760).toString(); // convert to heb year
      let geoYear: number = now.getFullYear(); // get year
      if (now.getMonth() > 6) { // after 1 in july get next year omer
        year = (now.getFullYear() + 3761).toString(); // go to next year
        geoYear = (now.getFullYear() + 1); // go to next year
      }
      const tz = now.getTimezoneOffset();
      console.log('tz: ' + tz);
      let localTz = -180;
      localStorage.getItem('sofrimTimezone') ? localTz = JSON.parse(localStorage.getItem('sofrimTimezone')) : localTz = -180;
      console.log('localTz: ' + localTz);
      // let force: boolean = false;
      if (localTz !== tz) {
        // force = true;
        console.log('force new data');
        localStorage.removeItem('omer' + geoYear);
      }
      if (!localStorage.getItem('omer' + geoYear)) { // if data for this year not exist
        const day = '16'; // heb day for first omer day
        const month = 'Nisan'; // heb month for first omer day
        let firstDateEvning: number;
        switch (geoYear) {
          case 2017:
            firstDateEvning = 1491922800000;
            break;
          case 2018:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1522508400000);
            break;
          case 2019:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1555772400000);
            break;
          case 2020:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1586444400000);
            break;
          case 2021:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1616943600000);
            break;
          case 2022:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1650121200000);
            break;
          case 2023:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1680793200000);
            break;
          case 2024:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1713884400000);
            break;
          case 2025:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1744556400000);
            break;
          case 2026:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1775142000000);
            break;
          case 2027:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1808406000000);
            break;
          case 2028:
            firstDateEvning = this.getFirstOmerAtUserTimeZone(1839078000000);
            break;
        }
        const omerForAllYear: number[] = []; // array for all omer days
        omerForAllYear.push(firstDateEvning); // push the first day
        for (let i = 1; i < 49; i++) {// loop for 48 more days
          omerForAllYear.push(firstDateEvning + (i * 86400000)); // add the next day
        }
        // console.log(omerForAllYear);
        localStorage.setItem('omer' + geoYear, JSON.stringify(omerForAllYear)); // put data in local storage
        // console.log(new Date(omerForAllYear[2]).toString());
        // this.notificationsService.setNotificationForAllOmer();
        res('done');
      } else {// data for this year allready exist
        const omerForTime = JSON.parse(localStorage.getItem('omer' + geoYear));
        // this.getFirstOmerAtUserTimeZone(omerForTime[0]);
        // this.correctTimeZone(omerForTime[0], geoYear);
        console.log('data exist for ' + geoYear);
        res('exist');
      }
    });
  }

  buildOmerArray(geoYear: number) {
    let firstDateEvning: number;
    switch (geoYear) {
      case 2017:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1491922800000);
        break;
      case 2018:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1522508400000);
        break;
      case 2019:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1555772400000);
        break;
      case 2020:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1586444400000);
        break;
      case 2021:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1616943600000);
        break;
      case 2022:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1650121200000);
        break;
      case 2023:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1680793200000);
        break;
      case 2024:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1713884400000);
        break;
      case 2025:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1744556400000);
        break;
      case 2026:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1775142000000);
        break;
      case 2027:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1808406000000);
        break;
      case 2028:
        firstDateEvning = this.getFirstOmerAtUserTimeZone(1839078000000);
        break;
    }
    const omerForAllYear: number[] = []; // array for all omer days
    omerForAllYear.push(firstDateEvning); // push the first day
    for (let i = 1; i < 49; i++) {// loop for 48 more days
      omerForAllYear.push(firstDateEvning + (i * 86400000)); // add the next day
    }
    // console.log(omerForAllYear);
    localStorage.setItem('omer' + geoYear, JSON.stringify(omerForAllYear)); // put data in local storage
  }

  getFirstOmerAtUserTimeZone(firstOmerDate: number) {
    console.log('--- firstOmerDate: ---');
    console.log(firstOmerDate);
    const omTz = new Date(firstOmerDate).getTimezoneOffset();
    const tz = new Date(Date.now());
    // console.log(tz);
    console.log('date.getTimezoneOffset()');
    console.log(tz.getTimezoneOffset());
    localStorage.setItem('sofrimTimezone', tz.getTimezoneOffset().toString());
    const offset = (-3) - (tz.getTimezoneOffset() / 60); // tz.getTimezoneOffset() / 60
    console.log(offset);
    // console.log(moment(tz));
    const newFirstOmerDate = firstOmerDate - (offset * 60 * 60 * 1000);
    console.log(newFirstOmerDate); // (-180 * 60 * 1000)
    console.log(new Date(newFirstOmerDate).toLocaleString());
    return newFirstOmerDate;
  }

  /* correctTimeZone(firstOmerDate: number, geoYear: number){
      let newFirstOmerDate = this.getFirstOmerAtUserTimeZone(firstOmerDate);
      if (newFirstOmerDate != firstOmerDate){
          this.buildOmerArray(geoYear);
      }else{
          console.log('no change to timezone');
      }
  } */

  getOmer(dateInMil: number) {// get the omer from date in millis
    // console.log(geoYear);
    const date = new Date(dateInMil); // millis to Date
    console.log(date.toString());
    let year: string = (date.getFullYear() + 3760).toString(); // convert to hebrew year
    let geoYear: number = date.getFullYear(); // get year
    if (date.getMonth() > 6) { // after 1 in july get next year omer
      year = (date.getFullYear() + 3761).toString();
      geoYear = (date.getFullYear() + 1);
    }
    console.log(geoYear);
    if (localStorage.getItem('omer' + geoYear)) {// if there is data in the local storage
      console.log('local exist');
      const omerDays: number[] = JSON.parse(localStorage.getItem('omer' + geoYear)); // get the data from local storage
      /*console.log("omerDays: " + omerDays);
      console.log("date.getTime(): " + date.getTime());
      console.log("omerDays[0]: " + omerDays[0]);
      console.log("omerDays[omerDays.length - 1]: " + omerDays[omerDays.length - 1]);
      console.log("date.getTime() < omerDays[0]: " + (date.getTime() < omerDays[0]));
      console.log("date.getTime() > omerDays[omerDays.length - 1]: " + (date.getTime() > omerDays[omerDays.length - 1]));*/

      // if date to search not in range of omer days
      if (date.getTime() < omerDays[0] || date.getTime() > (omerDays[omerDays.length - 1] + 86400000)) {
        this.omer = this.getNotOmerMsg(date.getMonth() + 1); // get omer msg based on the month
        this.hebDate = ''; // claer heb date data
        console.log('not omer date');
        this.isOmer = false;
      } else {// if date to search is in range of omer days
        omerDays.forEach((day, index) => {// loop all array to find the omer day
          if (date.getTime() >= day && date.getTime() < (day + 86400000)) {// omerDays[index + 1]
            this.omer = C.omerDays[index].getOmerString(this.settingsService.nosach); // get omer msg based on nosach
            this.zohar = C.omerDays[index].zohar;
            this.hebDate = this.buildHebDate(index, date.getTime()); // get heb date
            this.kavana = C.omerDays[index].kavana;
            this.omerNum = C.omerDays[index].omerDayId;
          }
        });
        this.isOmer = true;
        console.log('omer date');
      }
    } else {
      console.log('omer data not avialebale for ' + geoYear);
      this.omer = this.getNotOmerMsg(date.getMonth() + 1);
      this.hebDate = ''; // claer heb date
      this.getHebDate(date.getDate().toString(), (date.getMonth() + 1).toString(), date.getFullYear().toString());
    }
  }

  getOmerIndexFormToday() {// get the omer from date in millis
    // console.log(geoYear);
    const date = new Date(Date.now()); // millis to Date
    console.log(date.toString());
    let year: string = (date.getFullYear() + 3760).toString(); // convert to hebrew year
    let geoYear: number = date.getFullYear(); // get year
    if (date.getMonth() > 6) { // after 1 in july get next year omer
      year = (date.getFullYear() + 3761).toString();
      geoYear = (date.getFullYear() + 1);
    }
    console.log(geoYear);
    if (localStorage.getItem('omer' + geoYear)) {// if there is data in the local storage
      console.log('local exist');
      const omerDays: number[] = JSON.parse(localStorage.getItem('omer' + geoYear)); // get the data from local storage
      /*console.log("omerDays: " + omerDays);
      console.log("date.getTime(): " + date.getTime());
      console.log("omerDays[0]: " + omerDays[0]);
      console.log("omerDays[omerDays.length - 1]: " + omerDays[omerDays.length - 1]);
      console.log("date.getTime() < omerDays[0]: " + (date.getTime() < omerDays[0]));
      console.log("date.getTime() > omerDays[omerDays.length - 1]: " + (date.getTime() > omerDays[omerDays.length - 1]));*/

      // if date to search not in range of omer days
      if (date.getTime() < omerDays[0] || date.getTime() > (omerDays[omerDays.length - 1] + 86400000)) {
        console.log('not omer date');
        return -1;
      } else {// if date to search is in range of omer days
        omerDays.forEach((day, index) => {// loop all array to find the omer day
          if (date.getTime() >= day && date.getTime() < (day + 86400000)) {// omerDays[index + 1]
            return index;
          }
        });
        console.log('omer date');
      }
    } else {
      console.log('omer data not avialebale for ' + geoYear);
      return -1;
    }
  }

  buildHebDate(indexOmerDay: number, dateInMil: number) {
    const date: Date = new Date(dateInMil);
    const weekDay = date.getDay();
    console.log(date.getHours());
    let stringToReturn = '';
    if (date.getHours() > 17) {// if after 17:59 then show ערב
      return C.hebWeekDays[weekDay] + ' בערב ' + C.omerDays[indexOmerDay].fullHebDate;
    } else {
      stringToReturn = 'יום ';
      return 'יום ' + C.hebWeekDays[weekDay] + ' ' + C.omerDays[indexOmerDay].fullHebDate;
    }
  }

  getNotOmerMsg(month: number) {
    if (month < 9 && month > 4) {
      return C.notOmerPassMsg;
    } else {
      return C.notOmerYetMsg;
    }
  }

  getHebDate(day: string, month: string, year: string) {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open('GET', this.buildUrl(day, month, year), true);
    xhr.onreadystatechange = (data) => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const date = JSON.parse(xhr.response);
        this.hebDate = date.hebrew;
        const hebMonth = date.hm;
        const hebDay = date.hd;
        this.omer = this.getNotOmerMsg(+month); //
        C.omerDays.forEach((omerDay) => {
          if (omerDay.hebrewDay === hebDay && omerDay.hebrewMonth === hebMonth) {
            this.omer = omerDay.getOmerString(this.settingsService.nosach);
          }
        });
        console.log(date);
        console.log(this.omer);
      }
    };
    xhr.send();
    console.log(xhr);
  }

  getHebDateForToday() {
    const now: Date = new Date(Date.now());
    const month: string = (now.getMonth() + 1).toString();
    console.log('month: ' + month);
    const day: string = now.getDate().toString();
    console.log('day: ' + day);
    const year: string = now.getFullYear().toString();
    console.log('year: ' + year);
    this.getHebDate(day, month, year);
  }

  buildUrl(day: string, month: string, year: string) {
    return this.startUtl + '&gy=' + year + '&gm=' + month + '&gd=' + day + this.endUrl;
  }

  buildGeoUrl(day: string, month: string, year: string) {
    return this.startGetGeoUrl + '&hy=' + year + '&hm=' + month + '&hd=' + day + this.endGetGeoUrl;
  }

}
